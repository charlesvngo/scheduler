import { useEffect, useReducer } from "react";
import axios from "axios";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_DAYS = "SET_DAYS";


export default function useVisualMode() {
  const reducer = (state, action) => {
    if (action.type === SET_DAY) {
      return { ...state, day: action.value };
    }
    if (action.type === SET_APPLICATION_DATA) {
      return {
        ...state,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers,
      };
    }
    if (action.type === SET_INTERVIEW) {
      return { ...state, appointments: action.value };
    }
    if (action.type === SET_DAYS) {
      return { ...state, days: action.value };
    }
    return state;
  };

  // Track all information to be passed down props. Takes in a reducer function to determine
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // On load, get information from API and set states
  useEffect(() => {
    // establish connection via websocket
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    webSocket.onopen = (event) => {
      webSocket.send("ping");
    }

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
    // Cleanup to close websocket
    return () => { webSocket.close() };
  }, []);

  // Create alias for day setter
  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  // Helper function that updates the spots in the daylist state. returns a daylist.
  const updateSpots = (state, appointments, id) => {
    // Create a deep copy of the state so the original is not modified
    const dayList = JSON.parse(JSON.stringify([ ...state.days ]));
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
