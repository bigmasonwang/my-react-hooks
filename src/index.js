import React from 'react';
import ReactDOM from 'react-dom/client';

const hookStates = [];
let hookIndex = 0;
const useMyState = (initialState) => {
  const isFirstRender = hookStates[hookIndex] === undefined;
  const state = isFirstRender ? initialState : hookStates[hookIndex];

  // need to freeze current hook's index
  const currentIndex = hookIndex;
  const setState = (newState) => {
    hookStates[currentIndex] = newState;
    renderApp();
  };
  hookIndex++;
  return [state, setState];
};

const App = () => {
  const [count, setCount] = useMyState(0);
  const [input, setInput] = useMyState('mason');

  return (
    <div>
      <div>
        <button onClick={() => setCount(count + 1)}>{count}</button>
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  hookIndex = 0;
  root.render(<App />);
};
renderApp();
