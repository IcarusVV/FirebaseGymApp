"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isFuture,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarProps {
  confirmedVisits: Date[];
  onDateSelect: (date: Date) => void;
  onConfirmClick: () => void;
}

export default function calendar({
  confirmedVisits,
  onDateSelect,
  onConfirmClick,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // generateCalendarDays as before
  const generateCalendarDays = (date: Date) => {
    const firstDay = startOfMonth(date);
    const lastDay = endOfMonth(date);
    const startWeek = startOfWeek(firstDay);
    const endWeek = endOfWeek(lastDay);
    const days = [];
    let cursor = startWeek;
    while (cursor <= endWeek) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return days;
  };

  const days = generateCalendarDays(currentDate);
  const isDateConfirmed = selectedDate
    ? confirmedVisits.some((d) => isSameDay(d, selectedDate))
    : false;

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(addDays(currentDate, -30))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(addDays(currentDate, 30))}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center text-muted-foreground mb-2">
        {daysInWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((day, idx) => {
          const isToday = isSameDay(day, new Date());
          const confirmed = confirmedVisits.some((d) => isSameDay(d, day));
          const selected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedDate(day);
                onDateSelect(day);
              }}
              className={`
                flex items-center justify-center h-10 rounded-md cursor-pointer
                ${selected ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"}
                ${isToday ? "border-2 border-red-500" : ""}
                ${confirmed ? "bg-green-200" : ""}
              `}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>

      <Button onClick={onConfirmClick} className="mx-auto mt-4 block">
        {isDateConfirmed ? "Remove Visit" : "Confirm Visit"}
      </Button>
    </div>
  );
}
