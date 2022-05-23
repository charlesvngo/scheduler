import React from "react";
import "components/Appointment/styles.scss";
import "components/Appointment/Header"
import Header from "components/Appointment/Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

// Appointment cards
const Appointment = (props) => {
  // Calls useVisualMode custom hook to track state of the appointment element. Mode determines what to show on the card.
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  // Creates saves a new appointmnet
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview (props.id, interview)
    transition(SHOW)
  }
  return (
    <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />
    )}
    {mode === CREATE && (
      <Form interviewers={props.interviewers} onCancel={()=> back()} onSave={save}/>
    )}
    </article>
  )
}

export default Appointment;