import React from "react";
import "components/Appointment/styles.scss";
import "components/Appointment/Header"
import Header from "components/Appointment/Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

const Appointment = (props) => {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  let appointment;
  if (mode === SHOW) {
    appointment = <Show student={props.interview.student} interview={props.interview} />;
  }

  if (mode === EMPTY) {
    appointment = <Empty />;
  }
  return (
    <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => console.log("Clicked onAdd")} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interview={props.interview}
      />
    )}
    </article>
  )
}

export default Appointment;