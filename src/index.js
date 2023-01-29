import React, { memo, useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';

const hookStates = [];
let hookIndex = 0;
const useMyState = (initialState) => {
  const isFirstRender = hookStates[hookIndex] === undefined;
  const state = isFirstRender ? initialState : hookStates[hookIndex];

  // need to freeze current hook's index, the variable in closure
  const currentIndex = hookIndex;

  const setState = (newState) => {
    hookStates[currentIndex] = newState;
    renderApp();
  };
  hookIndex++;
  return [state, setState];
};

const useMyCallback = (callback, dependencies) => {
  if (hookStates[hookIndex]) {
    const [lastCallback, lastDependencies] = hookStates[hookIndex];
    const isSame = dependencies.every(
      (dependency, index) => dependency === lastDependencies[index]
    );
    if (isSame) {
      hookIndex++;
      return lastCallback;
    }
    hookStates[hookIndex] = [callback, dependencies];
    hookIndex++;
    return callback;
  }
  // first render
  hookStates[hookIndex] = [callback, dependencies];
  hookIndex++;
  return callback;
};

const Child = ({ value, onClick }) => {
  console.log('Child component render');
  return <button onClick={onClick}>{value}</button>;
};
// will not rerender if props not change
const MemorisedChild = memo(Child);

const App = () => {
  const [count, setCount] = useMyState(0);
  const [input, setInput] = useMyState('mason');

  const handleButtonClick = () => setCount(count + 1);

  return (
    <div>
      <div>
        <MemorisedChild value={count} onClick={handleButtonClick} />
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
