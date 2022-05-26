const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_DAYS = "SET_DAYS";

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
  throw new Error('tried to reduce with unsupported action type');
};

export {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SET_DAYS
}