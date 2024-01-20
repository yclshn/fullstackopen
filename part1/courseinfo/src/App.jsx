const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Part = (props) => {
  return (
    <div>
      <p>
        {props.part} {props.exercise}
      </p>
    </div>
  );
};

const Content = (props) => {
  return (
    <div>
      <Part part={props.content[0].part} exercise={props.content[0].exercise} />
      <Part part={props.content[1].part} exercise={props.content[1].exercise} />
      <Part part={props.content[2].part} exercise={props.content[2].exercise} />
    </div>
  );
};

const Total = (props) => {
  return (
    <p>
      <span>Number of exercises </span>
      {props.total[0].exercise +
        props.total[1].exercise +
        props.total[2].exercise}
    </p>
  );
};

const App = () => {
  const courses = {
    name: "Half Stack application development",
    parts: [
      { part: "Fundamentals of React", exercise: 10 },
      { part: "Using props to pass data", exercise: 7 },
      { part: "State of a component", exercise: 14 },
    ],
  };

  return (
    <div>
      <Header name={courses.name} />
      <Content content={courses.parts} />
      <Total total={courses.parts} />
    </div>
  );
};

export default App;
