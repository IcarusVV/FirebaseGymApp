
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, startOfWeek, endOfWeek, format } from "date-fns";

function getWeekDays(date: Date) {
  const startDate = startOfWeek(date, { weekStartsOn: 0 }); // Start week on Sunday
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
}

export default function GroupsPage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const weekDays = getWeekDays(selectedWeek);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Group Gym Visits (Weekly)</h2>
      <div className="border rounded-md p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day.toISOString()} className="flex flex-col items-center">
              <p className="text-sm">{format(day, "EEE")}</p>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {/* Placeholder for group members' avatars or initials */}
                <span>{format(day, "d")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

