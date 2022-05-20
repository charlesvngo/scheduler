import React from "react";
import "components/Appointment/styles.scss";
import "components/Appointment/Header"
import Header from "components/Appointment/Header";
import Show from "./Show";
import Empty from "./Empty";

const Appointment = (props) => {
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {props.interview ? <Show student={props.interview.student} interview={props.interview}/> : <Empty />}
    </article>
  )
}

export default Appointment;