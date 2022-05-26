import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

// list items for the side menu
const DayListItem = (props) => {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })

  const formatSpots = (spots) => {
    let output = '';
    if( spots > 1) output = `${spots} spots remaining`;
    if( spots === 1) output =  '1 spot remaining';
    if( spots === 0) output = 'no spots remaining';
    return output;
  }

  return (
    <li className={dayClass} data-testid="day" onClick={() => props.setDay(props.name)} selected={props.selected}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}

export default DayListItem;