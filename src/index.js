import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const states = [];
let index = 0;
const useMyState = (initialState) => {
  const state = states[index] || initialState;
  // need to freeze current hook's index
  const currentIndex = index;
  const setState = (newState) => {
    states[currentIndex] = newState;
    renderApp();
  };
  index++;
  return [state, setState];
};

const App = () => {
  const [count, setCount] = useMyState(0);
  const [count2, setCount2] = useMyState(0);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <div>{count2}</div>
      <button onClick={() => setCount2(count2 + 2)}>+</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  index = 0;
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
renderApp();
