import { useState, useEffect } from "react";
import dayjs from "dayjs";
import AttributeServices from "../../services/AttributeServices";
import useAsync from "../../hooks/useAsync";

export const BASE_PRICE_PER_DAY = 200;

export const useHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const { data, loading: holidaysLoading } = useAsync(
    AttributeServices.getAllHolidays
  );
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setHolidays(data.map((h) => dayjs(h.date).format("YYYY-MM-DD")));
    }
  }, [data]);
  return { holidays, holidaysLoading };
};

export const isWeekend = (date) => [0, 6].includes(dayjs(date).day());

export const isHoliday = (date, holidays) =>
  holidays.includes(dayjs(date).format("YYYY-MM-DD"));

export const isWorkingDay = (date, holidays) =>
  !isWeekend(date) && !isHoliday(date, holidays);

export const calculateWorkingDays = (startDate, endDate, holidays) => {
  let count = 0;
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    current = current.add(1, "day");
  }
  return count;
};

export const calculateEndDateByWorkingDays = (startDate, workingDays, holidays) => {
  let count = 0;
  let current = dayjs(startDate);
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }
  while (count < workingDays) {
    if (isWorkingDay(current, holidays)) {
      count++;
    }
    if (count < workingDays) {
      current = current.add(1, "day");
    }
  }
  while (!isWorkingDay(current, holidays)) {
    current = current.add(1, "day");
  }
  return current;
};

export const calculatePlans = (holidays, childCount = 1, customStartDates = {}) => {
  let todayDefault = dayjs().add(2, "day");
  while (!isWorkingDay(todayDefault, holidays)) {
    todayDefault = todayDefault.add(1, "day");
  }
  const discounts =
    childCount >= 2
      ? { 22: 0.05, 66: 0.15, 132: 0.2 }
      : { 22: 0, 66: 0.05, 132: 0.1 };

  return [
    {
      id: 1,
      label: `22 Working Days`,
      workingDays: 22,
      price: Math.round(
        22 * BASE_PRICE_PER_DAY * (1 - discounts[22]) * childCount
      ),
      discount: discounts[22],
      isOneMonth: true,
      startDate: customStartDates[1] || todayDefault,
      endDate: calculateEndDateByWorkingDays(
        customStartDates[1] || todayDefault,
        22,
        holidays
      ),
    },
    {
      id: 3,
      label: `66 Working Days`,
      workingDays: 66,
      price: Math.round(
        66 * BASE_PRICE_PER_DAY * (1 - discounts[66]) * childCount
      ),
      discount: discounts[66],
      isOneMonth: false,
      startDate: customStartDates[3] || todayDefault,
      endDate: calculateEndDateByWorkingDays(
        customStartDates[3] || todayDefault,
        66,
        holidays
      ),
    },
    {
      id: 6,
      label: `132 Working Days`,
      workingDays: 132,
      price: Math.round(
        132 * BASE_PRICE_PER_DAY * (1 - discounts[132]) * childCount
      ),
      discount: discounts[132],
      isOneMonth: false,
      startDate: customStartDates[6] || todayDefault,
      endDate: calculateEndDateByWorkingDays(
        customStartDates[6] || todayDefault,
        132,
        holidays
      ),
    },
  ];
};