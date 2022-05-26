// Helper function that will return an array of appointments in a day
export const getAppointmentsForDay = (state, day) => {
  const filteredDay = state.days.filter((days) => days.name === day);
  const appointmentArray = filteredDay[0]
    ? filteredDay[0].appointments.map(
        (appointmentId) => state.appointments[appointmentId]
      )
    : [];
  return appointmentArray;
};

// Helper function that will return an array of interviewers in a day
export const getInterviewersForDay = (state, day) => {
  const filteredDay = state.days.filter((days) => days.name === day);
  const interviewerArray = filteredDay[0]
    ? filteredDay[0].interviewers.map(
        (interviewerId) => state.interviewers[interviewerId]
      )
    : [];
  return interviewerArray;
};

// Helper function that formats the interview object to include interview details
export const getInterview = (state, interview) => {
  let filteredInterview = { ...interview };
  if (!interview) {
    return null;
  }

  for (const interviewerId in state.interviewers) {
    if (Number(interviewerId) === Number(interview.interviewer)) {
      filteredInterview.interviewer = state.interviewers[interviewerId];
    }
  }
  return filteredInterview;
};
