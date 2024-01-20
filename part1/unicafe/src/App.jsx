import { useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = all > 0 ? (good - bad) / all : 0;
  const positive = all > 0 ? good / all : 0;
  const positivePercent = `${positive} %`;

  if (all === 0) {
    return <p>No feedback given</p>;
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positivePercent} />
        </tbody>
      </table>
    );
  }
};

const App = () => {
  // save clicks of each button
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClickGood = () => {
    return setGood(good + 1);
  };

  const handleClickNeutral = () => {
    return setNeutral(neutral + 1);
  };

  const handleClickBad = () => {
    return setBad(bad + 1);
  };

  return (
    <div>
      <h2>give feedback</h2>
      <div>
        <Button handleClick={handleClickGood} text={"good"} />
        <Button handleClick={handleClickNeutral} text={"neutral"} />
        <Button handleClick={handleClickBad} text={"bad"} />
      </div>
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
