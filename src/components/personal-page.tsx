"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, addDays, isWithinInterval, isFuture, addMonths } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGymContext } from "@/context/gym-context";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const daysInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateCalendarDays = (currentDate: Date) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const firstDayOfWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const lastDayOfWeek = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

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
    const [visitData, setVisitData] = useState([]);

    useEffect(() => {
        // Generate random historical data for the past 6 months
        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        const newData = [];

        let currentDate = sixMonthsAgo;
        while (currentDate <= today) {
            const visits = Math.floor(Math.random() * 5) + 1; // Random visits between 1 and 5
            const day = new Date(currentDate);
            day.setDate(currentDate.getDate() + Math.floor(Math.random() * 7));
            newData.push({
                date: format(currentDate, "yyyy-MM-dd"),
                visits: confirmedVisits.filter(visit => format(visit, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd")).length
            });
            currentDate = addDays(currentDate, 7);
        }
        setVisitData(newData);
    }, [confirmedVisits]);

  const calendarDays = generateCalendarDays(currentDate);

  const isDateConfirmed = selectedDate
    ? confirmedVisits.some(visit => isSameDay(visit, day))
    : false;

  const handleVisitConfirmation = () => {
    if (selectedDate && isFuture(selectedDate)) {
      toast({
        title: "Error",
        description: "You cannot log exercise in the future!",
        variant: "destructive",
      });
      return;
    }
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
        // Update the chart data when a visit is confirmed
        setVisitData(prevData => {
          const dateStr = format(selectedDate, "yyyy-MM-dd");
          const existingDataIndex = prevData.findIndex(item => item.date === dateStr);

          if (existingDataIndex !== -1) {
            // If the date already exists, update the visits count
            const newData = [...prevData];
            newData[existingDataIndex] = { ...newData[existingDataIndex], visits: newData[existingDataIndex].visits + 1 };
            return newData;
          } else {
            // If the date doesn't exist, add a new data point
            return [...prevData, { date: dateStr, visits: 1 }];
          }
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
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
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
          {calendarDays.map((day, index) => {
            const isConfirmed = confirmedVisits.some(visit => isSameDay(visit, day));
            return (
              <div
                key={index}
                className={`flex items-center justify-center h-10 w-full rounded-md
                ${isSameDay(day, selectedDate) ? "bg-primary text-primary-foreground" : "hover:bg-[hsla(300,100%,50%,0.5)]"}
                ${format(day, "MMMM") !== format(currentDate, "MMMM") ? "text-muted-foreground" : ""}
                ${isSameDay(day, new Date()) ? "text-red-500" : ""}
                ${isConfirmed ? "bg-green-200" : ""} cursor-pointer select-none
              `}
                onClick={() => {
                  setSelectedDate(day);
                }}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
                <Button onClick={handleVisitConfirmation} className="mt-4 bg-primary text-primary-foreground hover:bg-[hsla(300,100%,50%,0.5)]">
                    {isDateConfirmed ? "Remove Visit" : "Confirm Visit"}
                </Button>
      <p className="mt-4">
        You have been to the gym {visitsThisWeek.length} times this week.
      </p>


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
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={visitData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}

