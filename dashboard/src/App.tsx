import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { TemperatureChart } from "./components/temperature-chart";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TemperatureChart />
      </header>
    </div>
  );
}

export default App;
