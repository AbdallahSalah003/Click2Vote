import "../styles/counter.css";

type CounterProps = {
  count: number;
  onClickPlus: () => void;
  onClickMinus: () => void;
}
export function Counter({count, onClickPlus, onClickMinus}: CounterProps) {

  return (
    <div className="counter-container">
      <button className="counter-btn" onClick={onClickMinus}>-</button>
      <div className="counter-box">{count}</div>
      <button className="counter-btn" onClick={onClickPlus}>+</button>
    </div>
  );
}
