import React from "react";

const Header = ({ name }) => {
  return (
    <header>
      <h2>{name}</h2>
    </header>
  );
};

const Content = ({ parts }) => {
  const sum = parts.reduce((acc, part) => acc + part.exercises, 0);

  return (
    <section>
      <div>
        {parts.map((part) => {
          return (
            <Part key={part.id} name={part.name} exercises={part.exercises} />
          );
        })}
      </div>
      <div>
        <h4>Total of {sum} exercises</h4>
      </div>
    </section>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <div>
      {name} {exercises}
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  );
};

export default Course;
