import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { title } from "process";
import { getTemperatures } from "../services/getTemperatures";
import { CircularProgress, LinearProgress } from "@mui/material";

// Generate Sales Data
function createData(time: string, value?: number) {
  return { time, value };
}

const data = [
  createData("00:00", 0),
  createData("03:00", 300),
  createData("06:00", 600),
  createData("09:00", 800),
  createData("12:00", 1500),
  createData("15:00", 2000),
  createData("18:00", 2400),
  createData("21:00", 2400),
  createData("24:00", undefined),
];

export interface DataPoints {
  time: string;
  value: number;
}

export interface TemperatureChartProps {
  title: string;
  name: string;
  data?: DataPoints[];
  yAxisTitle?: string;
  xAxisTitle?: string;
}

export default function TemperatureChart({
  title,
  name,
  yAxisTitle,
  xAxisTitle,
}: TemperatureChartProps) {
  const theme = useTheme();

  const [dataLoaded, setDataLoaded] = React.useState<boolean>(false);
  const [data, setData] = React.useState<DataPoints[]>([]);

  React.useEffect(() => {
    getTemperatures(name, "123", "123").then((data) => {
      setDataLoaded(true);
      setData(data.temperatures);
    });
  }, []);

  return (
    <React.Fragment>
      <Title>{title}</Title>
      {!dataLoaded && <CircularProgress />}
      {dataLoaded && (
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis
              dataKey="time"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            >
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: "middle",
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
              >
                {yAxisTitle}
              </Label>
            </YAxis>
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="value"
              stroke={theme.palette.primary.main}
              dot={false}
              label={xAxisTitle}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}
