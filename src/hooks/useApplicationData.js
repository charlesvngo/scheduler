import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useVisualMode() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_DAYS = "SET_DAYS"

  const reducer = (state, action) => {
    if(action.type === SET_DAY) {
      return { ...state, day: action.value };
    }
    if(action.type === SET_APPLICATION_DATA) {
      return { 
        ...state, 
        days: action.value.days, 
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      }
    }
    if(action.type === SET_INTERVIEW) {
      return { ...state, appointments: action.value }
    }
    if(action.type === SET_DAYS) {
      return { ...state, days: action.value }
    }
    return state;
  }

  // Track all information to be passed down props. Takes in a reducer function to determine 
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // On load, get information from API and set states
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [ days, appointments, interviewers ] = all
      dispatch({ type: SET_APPLICATION_DATA , value: {days: days.data, appointments: appointments.data, interviewers: interviewers.data}})
    });
  },[])

  // Create alias for day setter
  const setDay = day => dispatch({ type: SET_DAY, value: day });


  const updateSpots = (isDelete, id) => {
    const dayList = [ ...state.days ]
    const day = dayList.find(day => day.name === state.day)
    if (isDelete) {
      day.spots += 1;
      return dayList;
    } 
    if (!state.appointments[id].interview) {
      day.spots -= 1;
      return dayList;
    }
    return dayList;
  }

  // Helper function to post interviews to the api.
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    // Return the promise so the component can handle mode transitions
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({ type: SET_INTERVIEW, value: appointments }))
      .then(() => dispatch({ type: SET_DAYS, value:  updateSpots(false, id)}))
  }

  // Helper function to delete interviews.
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]:appointment
    }
    // Return the promise so the component can handle mode transitions
    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, value: appointments }))
      .then(() => dispatch({ type: SET_DAYS, value: updateSpots(true, id)}))

  }

  return { state, setDay, bookInterview, cancelInterview }
}