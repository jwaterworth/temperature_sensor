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
import {
  CombinedSeriesData,
  dateToString,
  getCombinedRoomData,
} from "../services/getTemperatures";
import { CircularProgress, Grid, LinearProgress, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../slices/store";
import { selectDateRange } from "../slices/dateRangeSlice";

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

  xAxisTitle = "Date";
  yAxisTitle = "Temperature (°C)";
  const [dataLoaded, setDataLoaded] = React.useState<boolean>(false);
  const [data, setData] = React.useState<CombinedSeriesData[]>([]);
  console.log(`${title} - data loaded: ${dataLoaded}`);

  const selectedDateRange = useSelector(selectDateRange);

  const setDataCallback = React.useCallback((newData: CombinedSeriesData[]) => {
    setDataLoaded(true);
    setData(newData);
  }, []);

  React.useEffect(() => {
    if (
      !selectedDateRange ||
      !selectedDateRange.startTimestamp ||
      !selectedDateRange.endTimestamp
    )
      return;
    getCombinedRoomData(
      name,
      dateToString(new Date(selectedDateRange.startTimestamp)),
      dateToString(new Date(selectedDateRange.endTimestamp))
    ).then((data) => {
      console.log(`${title} - retrieved data}`)
      setDataCallback(data.combinedData);
    });
  }, [selectedDateRange]);

  return (
    <Grid item xs={12} lg={6}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 240,
        }}
      >
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
                yAxisId="left"
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
                  Temperature (°C)
                </Label>
              </YAxis>
              <YAxis
                yAxisId="right"
                stroke={theme.palette.text.secondary}
                style={theme.typography.body2}
                orientation="right"
              >
                <Label
                  angle={270}
                  position="right"
                  style={{
                    textAnchor: "middle",
                    fill: theme.palette.text.primary,
                    ...theme.typography.body1,
                  }}
                >
                  Humidity
                </Label>
              </YAxis>
              <Line
                yAxisId="left"
                isAnimationActive={false}
                type="monotone"
                stroke={theme.palette.primary.main}
                dot={true}
                dataKey="temperature"
                label="Date"
              />
              <Line
                yAxisId="right"
                isAnimationActive={false}
                type="monotone"
                stroke={theme.palette.error.main}
                dot={true}
                dataKey="humidity"
                label="Date"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Grid>
  );
}
