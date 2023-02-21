import { useEffect, useRef, useState } from "react";
import { line, max, scaleLinear, select } from "d3";

export function TemperatureChartOld() {
  const elRef = useRef<HTMLElement>(null);
  const [temperatures, setTemperatures] = useState<number[]>([]);
  const width = 300;
  const height = 100;
  useEffect(() => {
    const interval = setInterval(() => {
      let temp = temperatures;
      if (temperatures.length > 10) {
        temp = temperatures.slice(1);
      }

      setTemperatures([...temp, Math.round(Math.random() * 100)]);
    }, 1000);

    if (elRef.current) {
      const wrapper = select(elRef.current);
      const xLinearScale = scaleLinear().domain([0, 10]).range([0, width]);
      const yLinearScale = scaleLinear().domain([0, 100]).range([height, 0]);
      const xAccessor = (_: number, value: number) => xLinearScale(value);

      const xLine = line<number>().x(xAccessor).y(yLinearScale);

      wrapper.select("svg").remove();

      const svg = wrapper
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

      svg.append("path").datum(temperatures).attr("d", xLine);
    }

    return () => clearInterval(interval);
  }, [temperatures]);

  return (
    <div>
      <h1>Temperature</h1>
      <p>{temperatures.join(", ")}</p>
      <h2>Chart</h2>
      <div className="chart">
        <figure
          data-chart={true}
          style={{ height, width, fill: "none", stroke: "white" }}
          ref={elRef}
        />
      </div>
    </div>
  );
}
