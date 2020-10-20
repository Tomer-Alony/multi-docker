import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fib = () => {
  const [seenIndexes, setSeenIndexs] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchIndexes = async () => {
    const indexes = await axios.get('/api/values');
    setSeenIndexs(indexes.data);
  };

  const fetchValues = async () => {
    const vals = await axios.get('/api/values/current');
    setValues(vals.data);
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ');
  };

  const renderValues = () => {
    return Object.keys(values).map((key) => {
      return (
        <div key={key}>
          For index {key}, I calculated value {values[key]}
        </div>
      );
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index,
    });

    setIndex('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor=''>Enter your index </label>
        <input
          type='text'
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen and stored on postgres database</h3>
      {renderSeenIndexes()}

      <h3>Values calculated by redis worker</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
