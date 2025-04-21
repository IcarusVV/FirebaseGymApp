"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, addDays, isWithinInterval, isFuture, addMonths } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DbService from "@/services/DbService";
import { Visit } from "@/types/DbTypes";

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
  const user = { id: 1, username: "JohnDoe" } // TODO: useAuth
  
  const [confirmedVisits, setConfirmedVisits] = useState<Date[]>([]);
  
  const [visitData, setVisitData] = useState([]);
  const [updateYAxis, setUpdateYAxis] = useState(0);

  useEffect(() => {
    async function fetchUserVisits() {
      try {
        const data = await DbService.FetchVisits(user.id);
        const visits = data.visits.map((visit: Visit) => new Date(visit.date));
        setConfirmedVisits(visits);
      } catch (error) {
        console.error("Failed to fetch visits:", error);
        toast({
          title: "Error",
          description: "Failed to load your gym visits.",
          variant: "destructive",
        });
      }
    }
    
    fetchUserVisits();
  }, []);

  const calendarDays = generateCalendarDays(currentDate);

  const isDateConfirmed = selectedDate
    ? confirmedVisits.some(visit => isSameDay(visit, selectedDate))
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

  const handleConfirm = async () => {
    if (selectedDate) {
      if (isDateConfirmed) {
        try {
          await DbService.RemoveVisit(user.id, selectedDate);
          
          // Update local state after successful API call
          setConfirmedVisits(prevVisits => 
            prevVisits.filter(visit => !isSameDay(visit, selectedDate))
          );
          
          toast({
            title: "Visit Removed!",
            description: `You've removed your gym visit on ${format(selectedDate, "PPP")}!`,
          });
        } catch (error) {
          console.error("Failed to remove visit:", error);
          toast({
            title: "Error",
            description: "Failed to remove your gym visit.",
            variant: "destructive",
          });
        }
      } else {
        try {
          // If you have a picture upload feature
          // const pictureInput = document.getElementById('picture');
          // if (pictureInput.files.length > 0) {
          //   formData.append('proofImage', pictureInput.files[0]);
          // }
          
          await DbService.AddVisit(user.id, selectedDate);
          
          // Update local state after successful API call
          setConfirmedVisits(prevVisits => [...prevVisits, selectedDate]);
          
          toast({
            title: "Visit Confirmed!",
            description: `You've confirmed your gym visit on ${format(selectedDate, "PPP")}!`,
          });
        } catch (error) {
          console.error("Failed to add visit:", error);
          toast({
            title: "Error",
            description: "Failed to confirm your gym visit.",
            variant: "destructive",
          });
        }
      }
      setUpdateYAxis(prev => prev + 1);
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
            const matchingVisit = confirmedVisits.find(visit => isSameDay(visit, day));
            const isConfirmed = selectedDate && matchingVisit && isSameDay(matchingVisit, day);
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={index}
                className={`flex items-center justify-center h-10 w-full rounded-md
                ${selectedDate && isSameDay(day, selectedDate)
                  ? "bg-primary text-primary-foreground" : "hover:bg-[hsla(300,100%,50%,0.5)]"}
                ${format(day, "MMMM") !== format(currentDate, "MMMM") ? "text-muted-foreground" : ""}
                ${isToday ? "border-2 border-red-500" : ""}
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
              {/* API INTEGRATION: File upload component for visit proof */}
              <Input id="picture" type="file" className="col-span-3" />
              {/* TODO: Add file upload handling to send proof to server */}
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
          <YAxis key={updateYAxis} />
          <Tooltip />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}