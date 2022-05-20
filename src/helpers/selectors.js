export const getAppointmentsForDay = (state, day) => {
  const filteredDay = state.days.filter((days) => days.name === day)
  const appointmentArray = filteredDay[0] ? filteredDay[0].appointments.map((appointmentId) => state.appointments[appointmentId]) : [];
  return appointmentArray;
}

export const getInterview = (state, interview) => {
  let filteredInterview = {...interview};
  if(!interview) {
    return null;
  }

  for (const interviewerId in state.interviewers) {
    if (Number(interviewerId) === Number(interview.interviewer)) {
      filteredInterview.interviewer = state.interviewers[interviewerId]
    }
  }
  return filteredInterview;
}