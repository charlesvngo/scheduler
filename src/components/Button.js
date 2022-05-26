import React from "react";
import classNames from "classnames";
import "components/Button.scss";

// Universal button that will be used for onClick handlers
const Button = (props) => {
  let buttonClass = classNames("button", {
    " button--confirm": props.confirm,
    " button--danger": props.danger,
  });

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
