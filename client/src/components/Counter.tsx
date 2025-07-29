import { useState } from "react";
import "../styles/counter.css";

export function Counter() {
  const [count, setCount] = useState(1);

  return (
    <div className="counter-container">
      <button className="counter-btn" onClick={() => setCount(count>1?count - 1:count)}>-</button>
      <div className="counter-box">{count}</div>
      <button className="counter-btn" onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
