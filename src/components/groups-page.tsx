"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, startOfWeek, endOfWeek, format } from "date-fns";
import { useGymContext } from "@/context/gym-context";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { confirmedVisits } = useGymContext();
  const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const visitsOnDate = selectedDate ? confirmedVisits.filter(date => format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) : [];

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
        setOpen(true);
    };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Group Gym Visits (Weekly)</h2>
      <div className="border rounded-md p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const isVisitConfirmed = confirmedVisits.some(
              (visit) => format(visit, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
            );

            return (
              <div
                key={day.toISOString()}
                className="flex flex-col items-center"
                onClick={() => handleDayClick(day)}
                style={{ cursor: "pointer" }}
              >
                <p className="text-sm">{format(day, "EEE")}</p>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isVisitConfirmed ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  <span>{format(day, "d")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gym Attendees</DialogTitle>
            <DialogDescription>
              List of gym attendees on {selectedDate ? format(selectedDate, "PPP") : "selected date"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <ScrollArea className="h-[200px] w-[300px]">
                {visitsOnDate.length > 0 ? (
                  visitsOnDate.map((date, index) => (
                    <div key={index} className="flex items-center space-x-4 py-2">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/50/50" alt="Gym Goer" />
                        <AvatarFallback>GG</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">Gym Goer {index + 1}</p>
                        <p className="text-sm text-muted-foreground">Last visit: {format(date, "hh:mm a")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No visits confirmed for this date.</p>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
