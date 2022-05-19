export const getAppointmentsForDay = (state, day) => {
  const filteredDay = state.days.filter((days) => days.name === day)
  const appointmentArray = filteredDay[0] ? filteredDay[0].appointments.map((appointmentId) => state.appointments[appointmentId]) : [];
  return appointmentArray;
}
