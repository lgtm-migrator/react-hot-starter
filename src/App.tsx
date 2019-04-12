import React, { SFC, useState } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';

export interface AppProps {}

const App: SFC<AppProps> = () => {
  const [count, setCount] = useState(0);

  return (
    <section className="App">
      <h1>React hot loader</h1>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(previousCount => previousCount + 1)}
        type="button"
      >
        Increment
      </button>
    </section>
  );
};

const withEnvironment: { [environment: string]: typeof App } = {
  production: App,
  development: hot(module)(App),
};

export default withEnvironment[process.env.NODE_ENV];
