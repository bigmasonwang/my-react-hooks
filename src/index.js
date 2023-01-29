import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
  const saveCallBackToHookStates = () => {
    hookStates[hookIndex] = [callback, dependencies];
    hookIndex++;
  };
  // first render
  if (hookStates[hookIndex] === undefined) {
    saveCallBackToHookStates();
    return callback;
  }
  // not first render
  const [lastCallback, lastDependencies] = hookStates[hookIndex];
  const isSame = dependencies.every(
    (dependency, index) => dependency === lastDependencies[index]
  );
  // dependencies didn't change
  if (isSame) {
    hookIndex++;
    return lastCallback;
  }
  saveCallBackToHookStates();
  return callback;
};

const useMyMemo = (factory, dependencies) => {
  const saveMemoToHookStates = () => {
    const memo = factory();
    hookStates[hookIndex] = [memo, dependencies];
    hookIndex++;
    return memo;
  };

  // first render
  if (hookStates[hookIndex] === undefined) {
    return saveMemoToHookStates();
  }
  // not first render
  const [lastMemo, lastDependencies] = hookStates[hookIndex];
  const isSame = dependencies.every(
    (dependency, index) => dependency === lastDependencies[index]
  );

  // dependencies didn't change
  if (isSame) {
    hookIndex++;
    return lastMemo;
  }

  return saveMemoToHookStates();
};

const Child = ({ value, onClick }) => {
  console.log('Child component render');
  return <button onClick={onClick}>{value}</button>;
};

// memo lets you skip re-rendering a component when its props are unchanged.
const MemorisedChild = memo(Child);

const App = () => {
  const [count, setCount] = useMyState(0);
  const [input, setInput] = useMyState('mason');

  const getSomeValueByCount = (count) => {
    console.log('heavy calculation');
    return count;
  };
  const memorisedValue = useMyMemo(() => getSomeValueByCount(count), [count]);

  const handleButtonClick = () => setCount(count + 1);
  // Because of my custom useState
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memorisedHandleClick = useMyCallback(handleButtonClick, [count]);

  return (
    <div>
      <div>
        <MemorisedChild value={memorisedValue} onClick={memorisedHandleClick} />
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
