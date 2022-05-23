import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

const Application = () => {
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

  // Run helper functions to obtain appointments & interviewers for the selected day.
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  
  // Create alias for day setter
  const setDay = day => setState({ ...state, day });

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
    setState({ ...state, appointments})
  }

  // Variable that holds the day's schedule
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
    <Appointment 
      key={appointment.id} 
      {...appointment}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
    />
    )
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
            days={state.days} 
            value={state.day} 
            onChange={setDay} 
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};

export default Application;
