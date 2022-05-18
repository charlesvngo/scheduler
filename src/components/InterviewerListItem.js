import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss";

const InterviewerListItem = (props) => {
  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });
  const interviewerImageClass = classNames("interviewers__item-image", {
    "interviewers__item-image--selected": props.selected,
  });

  return (
    <li className={interviewerClass} selected={props.selected} onClick={() => {props.setInterviewer(props.id)}}>
      <img
        className={interviewerImageClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};

export default InterviewerListItem;
