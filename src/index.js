import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const useMyState = (initialState) => {
  let state = initialState;
  const setState = (newState) => {
    state = newState;
    console.log(state);
  };

  return [state, setState];
};

const App = () => {
  const [count, setCount] = useMyState(0);
  return (
    <div>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
renderApp();
