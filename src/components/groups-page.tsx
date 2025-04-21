// src/components/groups-page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { addDays, startOfWeek, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Crown, Check, X } from "lucide-react";
import GymService from "@/services/GymService";


interface Member {
  id: number;
  name: string;
}

export interface GroupProps {
  id: number;
  name: string;
  members: User[];
}

function getWeekDays(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
}

export default function GroupsPage({
  group,
  setActiveGroup,
}: {
  group: GroupProps;
  setActiveGroup: () => void;
}) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [visitsMap, setVisitsMap] = useState<Record<number, Date[]> | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekStart = useMemo(
    () => startOfWeek(selectedWeek, { weekStartsOn: 0 }),
    [selectedWeek]
  );
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  const weekDays = useMemo(() => getWeekDays(selectedWeek), [selectedWeek]);

  // 1️⃣ Fetch all visits for this squad & week
  useEffect(() => {
    setLoading(true);
    GymService.getSquadVisits(
      group.id,
      format(weekStart, "yyyy-MM-dd"),
      format(weekEnd, "yyyy-MM-dd")
    )
      .then((records) => {
        console.log("Raw visit records:", records); // <- Add this line
  
        if (!Array.isArray(records)) {
          throw new Error("Expected an array of visits, but got something else.");
        }
  
        const map: Record<number, Date[]> = {};
        records.forEach(({ user_id, visit_date }) => {
          const dt = new Date(visit_date);
          if (dt >= weekStart && dt <= weekEnd) {
            map[user_id] = map[user_id] || [];
            map[user_id].push(dt);
          }
        });
        setVisitsMap(map);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load visit data.");
      })
      .finally(() => setLoading(false));
  }, [group.id, weekStart, weekEnd]);


  if (loading) return <p>Loading visits…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!visitsMap) return null;

  // 2️⃣ Build an array of { member, visits[] }
  const memberVisits = group.members.map((m) => ({
    member: m,
    visits: visitsMap[m.id] || [],
  }));

  // 3️⃣ Find who has the most visits
  const { member: champ } = memberVisits.reduce(
    (best, cur) => (cur.visits.length > best.visits.length ? cur : best),
    { member: { id: -1, name: "" }, visits: [] as Date[] }
  );

  // 4️⃣ Gather visits for the dialog on the selected date
  const visitsOnDate =
    selectedDate
      ? memberVisits.flatMap(({ member, visits }) =>
          visits
            .filter(
              (v) => format(v, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
            )
            .map((v) => ({ member, date: v }))
        )
      : [];

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setOpen(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end">
        <Button onClick={setActiveGroup} className="mb-4">
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
                  {format(day, "EEE")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {memberVisits.map(({ member, visits }) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  {member.username}
                  {champ.id === member.id && (
                    <Crown className="inline-block h-4 w-4 text-yellow-500" />
                  )}
                </TableCell>

                {weekDays.map((day) => {
                  const isConfirmed = visits.some(
                    (v) => format(v, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                  );

                  return (
                    <TableCell key={day.toISOString()} className="text-center">
                      <div
                        onClick={() => handleDayClick(day)}
                        style={{ cursor: "pointer" }}
                      >
                        {isConfirmed ? (
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
              Attendees on{" "}
              {selectedDate ? format(selectedDate, "PPP") : "—"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[200px] w-full">
            {visitsOnDate.length > 0 ? (
              visitsOnDate.map(({ member, date }, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 py-2 px-2"
                >
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/50/50" alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(date, "hh:mm a")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4">No visits confirmed for this date.</p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
