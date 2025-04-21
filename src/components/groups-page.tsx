"use client";

import { useState, useEffect, useContext } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, startOfWeek, format, isWithinInterval } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Visit, User } from "@/types/DbTypes";
import DbService from "@/services/DbService";


interface GroupProps {
  name: string;
  id: number;
  members: { name: string; id: string }[];
}

function getWeekDays(date: Date) {
  const startDate = startOfWeek(date, { weekStartsOn: 0 }); // Start week on Sunday
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
}

function getMemberVisitsThisWeek(
  confirmedVisits: Visit[],
  weekStart: Date,
  weekEnd: Date,
): Date[] {
    return confirmedVisits.filter((visit) =>
      isWithinInterval(visit.timestamp, { start: weekStart, end: weekEnd })
    ).map(visit => new Date(visit.timestamp));
}

export default function GroupsPage({ group, setActiveGroup }: { group: GroupProps, setActiveGroup: (groupName: string | null) => void }) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const weekDays = getWeekDays(selectedWeek);
  const [members, setMembers] = useState<User[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchGroupData = async () => {
      const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 0 });
      const weekEnd = addDays(weekStart, 6);
  
      const groupMembers = await DbService.GetGroupMembers(group.id);
      const groupVisits = await DbService.GetVisitsForGroupInWeek(group.name, weekStart, weekEnd);
  
      setMembers(groupMembers);
      setVisits(groupVisits);
    };
  
    fetchGroupData();
  }, [group.name, selectedWeek]);
  

  const visitsOnDate = selectedDate
    ? visits.filter(
        (visit) => format(visit.timestamp, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setOpen(true);
  };

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 0 });
  const weekEnd = addDays(weekStart, 6);

  const memberVisits = members.map((member) => ({
    member,
    visits: getMemberVisitsThisWeek(visits, weekStart, weekEnd),
  }));

  const memberWithMostVisits = memberVisits.reduce(
    (maxVisitsMember, currentMember) => {
      return currentMember.visits.length > maxVisitsMember.visits.length
        ? currentMember
        : maxVisitsMember;
    },
    { member: { name: "", id: "" }, visits: [] }
  ).member;

  return (
    <div className="flex flex-col items-center">
        <div className="w-full flex justify-end">
            <Button onClick={() => setActiveGroup(null)} className="mb-4">
                Back to Groups
            </Button>
        </div>
      <h2 className="text-2xl font-semibold mb-4">{group.name}</h2>

      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Member</TableHead>
              {weekDays.map((day) => (
                <TableHead
                  key={day.toISOString()}
                  className="w-[calc(100%/7)] text-center"
                >
                  {format(day, "EEE")} {format(day, "d")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.name}{" "}
                  {memberWithMostVisits.id === member.id && (
                    <Crown className="inline-block h-4 w-4 text-yellow-500" />
                  )}
                </TableCell>
                {weekDays.map((day) => {
                  const isVisitConfirmed = visits.some(
                    (visit) =>
                      visit.userId === member.id &&
                      format(new Date(visit.timestamp), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                  );
                  

                  return (
                    <TableCell key={day.toISOString()} className="text-center">
                      <div
                        onClick={() => handleDayClick(day)}
                        style={{ cursor: "pointer" }}
                      >
                        {isVisitConfirmed ? (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto bg-green-200">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto bg-red-200">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gym Attendees</DialogTitle>
            <DialogDescription>
              List of gym attendees on{" "}
              {selectedDate ? format(selectedDate, "PPP") : "selected date"}.
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
                        <p className="text-sm font-medium leading-none">
                          Gym Goer {index + 1}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last visit: {format(date, "hh:mm a")}
                        </p>
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
