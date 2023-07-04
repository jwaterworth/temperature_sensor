// date picker component

import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { useDispatch } from "react-redux";
import { setSelectedDateRange } from "../slices/dateRangeSlice";
import { Button, Paper, Popper, styled } from "@mui/material";
import { makeStyles } from "@mui/material/styles";

const DATE_RANGE_KEY = "selection";

const OpenButton = styled(Button)(({ theme }) => ({
  marginRight: "10px",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const PickerPopper = styled(Popper)({
  zIndex: 1,
});

const PickerPaper = styled(Paper)({
  marginTop: "10px",
  padding: "16px",
});

export const DatePicker: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<RangeKeyDict>({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  });

  // toggle date picker
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const dispatch = useDispatch();

  // handler for date picker
  const onDateChange = (ranges: RangeKeyDict) => {
    console.log(ranges);
    setSelectedRange(ranges);
    const { startDate, endDate } = ranges[DATE_RANGE_KEY];
    setSelectedRange(ranges);
    if (!startDate || !endDate) return;
    dispatch(setSelectedDateRange({dateRange: { startTimestamp: (startDate as Date).getTime(), endTimestamp: (endDate as Date).getTime() }}));
    
  };

  const dateRangePickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Add event listener to listen for clicks outside the date picker
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dateRangePickerRef.current &&
        !(dateRangePickerRef.current as Node).contains(event.target as Node) &&
        buttonRef.current &&
        !(buttonRef.current as Node).contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <OpenButton
        id="open-button"
        onClick={() => setShowDatePicker(!showDatePicker)}
        ref={buttonRef}
      >
        {/* show start and end date in button */}
        {selectedRange[DATE_RANGE_KEY].startDate?.toLocaleDateString()} -{" "}
        {selectedRange[DATE_RANGE_KEY].endDate?.toLocaleDateString()}
      </OpenButton>
      {showDatePicker && (
        <PickerPopper
          open={showDatePicker}
          anchorEl={document.querySelector("#open-button")}
          placement="bottom-start"
          ref={dateRangePickerRef}
        >
          <PickerPaper>
            <DateRangePicker
              ranges={[selectedRange.selection]}
              onChange={(newValue) => onDateChange(newValue)}
              moveRangeOnFirstSelection={false}
            />
          </PickerPaper>
        </PickerPopper>
      )}
    </div>
  );
};
