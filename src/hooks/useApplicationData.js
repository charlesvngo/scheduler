import { useState, useEffect } from "react";
import axios from "axios";

export default function useVisualMode() {

  // Track all information to be passed down props
  const [state, setState] = useState({
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
      setState(prev => ({ ...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}))
    });
  },[])

  // Create alias for day setter
  const setDay = day => setState({ ...state, day });

  // Helper function to post interviews to the api.
  const bookInterview = (id, interview, cb, mode) => {
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
      .then(() => setState({ ...state, appointments }))
  }

  // Helper function to delete interviews.
  const cancelInterview = (id, cb, mode) => {
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
      .then(() => setState({ ...state, appointments }))
  }

  return { state, setDay, bookInterview, cancelInterview }
}