import { differenceInDays, addDays, isAfter, isBefore, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

export const calculateNights = (checkIn, checkOut) => {
  return differenceInDays(new Date(checkOut), new Date(checkIn));
};

export const calculateTotalPrice = (nightlyRate, checkIn, checkOut) => {
  const nights = calculateNights(checkIn, checkOut);
  return nightlyRate * nights;
};

// Other utility functions...

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  return format(date, formatStr, { locale: es });
};

export const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (isBefore(currentDate, new Date(endDate))) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

export const isPastDate = (date) => {
  return isBefore(new Date(date), new Date());
};

export const isValidDateRange = (startDate, endDate) => {
  return isAfter(new Date(endDate), new Date(startDate));
};

export const parseDate = (dateString) => {
  return parseISO(dateString);
};

export const getDayOfWeek = (date, formatStr = 'EEEE') => {
  return format(new Date(date), formatStr, { locale: es });
};

export const addDaysToDate = (date, days) => {
  return addDays(new Date(date), days);
};

export const doDateRangesOverlap = (start1, end1, start2, end2) => {
  return (
    (isBefore(new Date(start1), new Date(end2)) && isAfter(new Date(end1), new Date(start2))) ||
    (isBefore(new Date(start2), new Date(end1)) && isAfter(new Date(end2), new Date(start1)))
  );
};