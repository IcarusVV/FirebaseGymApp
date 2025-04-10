"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, addDays, isWithinInterval } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGymContext } from "@/context/gym-context";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateCalendarDays = (currentDate: Date) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const firstDayOfWeek = startOfWeek(firstDayOfMonth);
  const lastDayOfWeek = endOfWeek(lastDayOfMonth);

  const calendarDays = [];
  let currentDay = firstDayOfWeek;

  while (currentDay <= lastDayOfWeek) {
    calendarDays.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return calendarDays;
};

export default function PersonalPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { confirmedVisits, addVisit, removeVisit } = useGymContext();

  const calendarDays = generateCalendarDays(currentDate);

  const isDateConfirmed = selectedDate
    ? confirmedVisits.some(visit => format(visit, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
    : false;

  const handleVisitConfirmation = () => {
    setOpen(true);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      if (isDateConfirmed) {
        removeVisit(selectedDate);
        toast({
          title: "Visit Removed!",
          description: `You've removed your gym visit on ${format(selectedDate, "PPP")}!`,
        });
      } else {
        addVisit(selectedDate);
        toast({
          title: "Visit Confirmed!",
          description: `You've confirmed your gym visit on ${format(selectedDate, "PPP")}!`,
        });
      }
    }
    setOpen(false);
  };

  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 0 });

  const visitsThisWeek = confirmedVisits.filter(visit =>
    isWithinInterval(visit, { start: startOfCurrentWeek, end: endOfCurrentWeek })
  );

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-semibold mb-4">Personal Gym Visits</h2>

      <div className="w-full p-4">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Days of the Week */}
        <div className="grid grid-cols-7 gap-2 text-center text-muted-foreground mb-2">
          {daysInWeek.map((day, index) => (
            <div key={index}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`flex items-center justify-center h-10 w-full rounded-md
                ${isSameDay(day, selectedDate) ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
                ${format(day, "MMMM") !== format(currentDate, "MMMM") ? "text-muted-foreground" : ""}
                ${isSameDay(day, new Date()) ? "text-red-500" : ""}
              `}
              onClick={() => {
                setSelectedDate(day);
              }}
            >
              {format(day, "d")}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4">
        You have been to the gym {visitsThisWeek.length} times this week.
      </p>

      <Button onClick={handleVisitConfirmation} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/80">
        {isDateConfirmed ? "Remove Visit" : "Confirm Visit"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Visit</DialogTitle>
            <DialogDescription>
              {isDateConfirmed ?
                `Are you sure you want to remove your gym visit for ${selectedDate ? format(selectedDate, "PPP") : "today"}?`
                : `Please confirm your gym visit for ${selectedDate ? format(selectedDate, "PPP") : "today"} and upload a proof.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                Picture
              </Label>
              <Input id="picture" defaultValue="placeholder" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
