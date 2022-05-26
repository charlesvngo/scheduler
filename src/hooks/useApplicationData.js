import { useEffect, useReducer } from "react";
import axios from "axios";
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_DAYS,
} from "reducers/application";

export default function useVisualMode() {
  // Track all information to be passed down props. Takes in a reducer function to determine
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    webSocket: null,
  });

  // On load, get information from API and set states
  useEffect(() => {
    state.webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    // establish connection via websocket
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data,
        },
      });
    });
    return;
  // Function will return a linting error regarding state.webSocket being called only once.
  // This is intended behavior to allow the websocket to only attach once and track the updated
  // state for the onmessage function below.
  // eslint-disable-next-line
  }, []);

  // Wait until state changes before loading webSocket.onmessage
  useEffect(() => {
    state.webSocket.onmessage = function (event) {
      const { id, interview, type } = JSON.parse(event.data);
      // take the ID and interview object and create an appointment object
      const appointment = {
        ...state.appointments[id],
        interview: interview ? { ...interview } : null,
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      // update state to the new state value.
      const days = updateSpots(state, appointments, id);
      dispatch({ type, value: appointments });

      // BUG: spots handling currently will only affect the current selected day.
      // Update spots needs a refactor to count spots based on state
      dispatch({ type: SET_DAYS, value: days });
    };
    return;
  }, [state]);

  // Create alias for day setter
  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  // Helper function that updates the spots in the daylist state. returns a daylist.
  const updateSpots = (state, appointments, id) => {
    // Create a deep copy of the state so the original is not modified
    const dayList = JSON.parse(JSON.stringify([...state.days]));
    const day = dayList.find((day) => day.name === state.day);
    // If the new appointment does not have a scheduled interview, one more spot is now available.
    if (!appointments[id].interview) {
      day.spots += 1;
      return dayList;
    }
    // If the old appointment does not have a scheduled interview, one less spot is now available.
    if (!state.appointments[id].interview) {
      day.spots -= 1;
      return dayList;
    }
    // otherwise, return the daylist without modified spots.
    return dayList;
  };

  // Helper function to post interviews to the api.
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = updateSpots(state, appointments, id);

    // Return the promise so the component can handle mode transitions
    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_INTERVIEW, value: appointments }))
      .then(() => dispatch({ type: SET_DAYS, value: days }));
  };

  // Helper function to delete interviews.
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = updateSpots(state, appointments, id);

    // Return the promise so the component can handle mode transitions
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, value: appointments }))
      .then(() => dispatch({ type: SET_DAYS, value: days }));
  };

  return { state, setDay, bookInterview, cancelInterview };
}
