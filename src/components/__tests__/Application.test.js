import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  getByTestId,
} from "@testing-library/react";

import Application from "../Application";

afterEach(cleanup);

it("changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);
  await waitForElement(() => getByText("Monday"));
  fireEvent.click(getByText("Tuesday"));
  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
  const { container, debug } = render(<Application />);
  // 1. Render the document
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 2. Click the add button
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];
  fireEvent.click(getByAltText(appointment, "Add"));
  fireEvent.click(getByText(container, "Cancel"));
  fireEvent.click(getByAltText(appointment, "Add"));

  // 3. Changed the name and interviewer
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });
  fireEvent.submit(getByTestId(appointment, "form"));
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  fireEvent.click(getByText(appointment, "Save"));

  // 4. Wait for save to appear and wait for the new appoint to show up
  expect(getByText(appointment, "Saving...")).toBeInTheDocument();
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  // 5. Verify that no more spots are present.
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );
  expect(getByText(day, "no spots remaining")).toBeInTheDocument();
});

it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  // 1. Render the Application.
  const { container, debug } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Delete" button on the first empty appointment.
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[1];
  fireEvent.click(getByAltText(appointment, "Delete"));
  fireEvent.click(getByText(appointment, "Cancel"));
  fireEvent.click(getByAltText(appointment, "Delete"));

  // 4. Click the confirm button.
  fireEvent.click(getByText(appointment, "Confirm"));

  // 5. Check that the element with the text "Deleting..." is displayed.
  expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

  // 6. Wait until the element with the text "Add" is displayed.
  await waitForElement(() => getByAltText(appointment, "Add"));

  // 7. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  // 1. Render the Application.
  const { container, debug } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Edit" button on the first empty appointment.
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[1];
  fireEvent.click(getByAltText(appointment, "Edit"));
  fireEvent.click(getByText(container, "Cancel"));
  fireEvent.click(getByAltText(appointment, "Edit"));

  // 4. Change the name and interviewer
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // 5. Click the confirm button.
  fireEvent.click(getByText(appointment, "Save"));

  // 5. Check that the element with the text "Saving..." is displayed.
  expect(getByText(appointment, "Saving...")).toBeInTheDocument();

  // 6. Wait until the element with the text "Lydia Miller-Jones" is displayed.
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  // 7. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});

it("shows the save error when failing to save an appointment", async () => {
  axios.put.mockRejectedValueOnce();
  // 1. Render the application
  const { container, debug } = render(<Application />);
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 2. Click the add button
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];
  fireEvent.click(getByAltText(appointment, "Add"));

  // 3. Change the name and interviewer
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" },
  });
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  // 4. Click the save button
  fireEvent.click(getByText(appointment, "Save"));

  // 5. Wait for error message and close it
  await waitForElement(() => getByText(appointment, "Error"));
  expect(getByText(appointment, "Error saving")).toBeInTheDocument();
  fireEvent.click(getByAltText(appointment, "Close"));

  // 6. Confirmed that the spots have not changed
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});

it("shows the save error when failing to delete an appointment", async () => {
  axios.delete.mockRejectedValueOnce();
  // 1. Render the Application.
  const { container, debug } = render(<Application />);

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));

  // 3. Click the "Delete" button on the first empty appointment.
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[1];

  fireEvent.click(getByAltText(appointment, "Delete"));

  // 4. Click the confirm button.
  fireEvent.click(getByText(appointment, "Confirm"));

  // 5. Check that the element with the text "Deleting..." is displayed.
  expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

  // 6. Wait until the element with the text "Error" is displayed.

  await waitForElement(() => getByText(appointment, "Error"));
  expect(getByText(appointment, "Error deleting")).toBeInTheDocument();
  fireEvent.click(getByAltText(appointment, "Close"));

  // 7. Check to see if the delete did not complete due to the error.
  const day = getAllByTestId(container, "day").find((day) =>
    queryByText(day, "Monday")
  );

  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
});
