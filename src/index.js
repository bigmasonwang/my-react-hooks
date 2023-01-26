import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

let _state;
const useMyState = (initialState) => {
  _state = _state || initialState;

  const setState = (newState) => {
    _state = newState;
    renderApp();
  };

  return [_state, setState];
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
