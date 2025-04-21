"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isFuture, isSameDay, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGymContext } from "@/context/gym-context";
import Calendar from "./Calendar";
import VisitsChart from "./VisitsChart";

export default function PersonalPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { confirmedVisits, addVisit, removeVisit } = useGymContext();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirmClick = () => {
    if (selectedDate && isFuture(selectedDate)) {
      return toast({ title: "Error", description: "Cannot log future visits", variant: "destructive" });
    }
    setOpen(true);
  };

  const handleDialogConfirm = () => {
    if (!selectedDate) return;
    const already = confirmedVisits.some((d) => isSameDay(d, selectedDate));
    if (already) removeVisit(selectedDate);
    else addVisit(selectedDate);
    setOpen(false);
  };

  // count this week’s visits
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const visitsThisWeek = confirmedVisits.filter((d) =>
    isWithinInterval(d, { start: weekStart, end: weekEnd })
  ).length;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-semibold mb-4">Personal Gym Visits</h2>

      <Calendar
        confirmedVisits={confirmedVisits}
        onDateSelect={handleDateSelect}
        onConfirmClick={handleConfirmClick}
      />

      <p className="mt-4">
        You have been to the gym {visitsThisWeek}{" "}
        {visitsThisWeek === 1 ? "time" : "times"} this week.
      </p>

      <VisitsChart confirmedVisits={confirmedVisits} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {/* … dialog header & description */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                Picture
              </Label>
              <Input id="picture" type="file" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={handleDialogConfirm}>Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
