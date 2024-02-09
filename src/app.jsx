import React from 'react';
import PropTypes from 'prop-types';

function App({ title, desc, age, gender }) {
  const bgcolor = 'red';
  const color = 'white';
  return (
    <>
      <p>
        {title} {desc}
      </p>
      <p>{gender}</p>
      <h1
        style={{
          background: bgcolor,
          color: color,
          textAlign: 'center',
        }}
      >
        Hello World
      </h1>
      {age > 0 && <h3>{age}</h3>}
      <button type="button">Submit</button>
    </>
  );
}

App.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  gender: PropTypes.oneOf(['male', 'female']),
};

App.defaultProps = {
  title: 'dfd',
  desc: 'dfdfer',
  age: 98,
  gender: 'male',
};

export default App;