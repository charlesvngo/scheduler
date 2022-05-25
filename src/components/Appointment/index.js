import React from "react";
import "components/Appointment/styles.scss";
import "components/Appointment/Header"
import Header from "components/Appointment/Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE= "ERROR_DELETE"

// Appointment cards
const Appointment = (props) => {
  // Calls useVisualMode custom hook to track state of the appointment element. Mode determines what to show on the card.
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  // Creates saves a new appointmnet
  const save = (name, interviewer) => {
    if (!name || !interviewer) {
      return;
    }
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVE)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
  }

  // Function that moves the form to the delete state and posts the delete. Will return an empty appointment after promise is done
  const deleteInterview = () => {
    transition(DELETE)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }

  return (
    <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && props.interview &&(
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={()=> transition(CONFIRM)}
        onEdit={()=>transition(EDIT)}
      />
    )}
    {mode === CREATE && (
      <Form 
        interviewers={props.interviewers} 
        onCancel={()=> back()} 
        onSave={save}
      />
    )}
    {mode === SAVE && (
      <Status message={"Saving..."}/>
    )}
    {mode === CONFIRM && (
      <Confirm 
        onConfirm={() => deleteInterview()} 
        onCancel={() => back()} 
      />
    )}
    {mode === DELETE && (
      <Status message={"Deleting..."} />
    )}
    {mode === EDIT && (
      <Form 
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        interviewers={props.interviewers} 
        onCancel={()=> back()} 
        onSave={save}
      />
    )}
    {mode === ERROR_DELETE && (
      <Error 
        message={"Error deleting"} 
        onClose={()=> transition(SHOW, true)}
      />
    )}
    {mode === ERROR_SAVE && (
      <Error 
        message={"Error saving"} 
        onClose={()=> transition(props.interview ? EDIT : EMPTY, true)}
      />
    )}
    </article>
  )
}

export default Appointment;