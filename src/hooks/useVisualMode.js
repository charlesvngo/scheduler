import { useState } from "react";

// Custom hook for the form element. Contains functions to change mode and revert to previous mode.
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([]);

  const transition = (newMode, replace = false) => {
    setHistory([...history, mode]);
    if (replace) {
      setHistory((prev) => [...prev].splice(prev.length - 2, 1));
    }
    setMode(newMode);
  };
  const back = () => {
    setMode(history[history.length - 1] ? history[history.length - 1] : mode);
    setHistory([...history].slice(0, history.length - 1));
  };
  return { mode, transition, back };
}
