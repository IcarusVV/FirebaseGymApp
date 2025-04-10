"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGymContext } from "@/context/gym-context";

export default function PersonalPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const { confirmedVisits, addVisit, removeVisit } = useGymContext();

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

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Personal Gym Visits</h2>
      <div className="p-4 w-full">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md"
          // Styling to highlight the days
          classNames={{
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 border-r border-b border-border",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
              "text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          }}
        />
      </div>
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
