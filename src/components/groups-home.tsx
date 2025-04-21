"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GroupsPage from "@/components/groups-page";
import GymService from "@/services/GymService";
import { Squad, User } from "../types/DbTypes";


interface GroupsHomeProps {
  /** The current logged‑in user’s ID */
  memberId: number;
}

export default function GroupsHome({ memberId }: GroupsHomeProps) {
  const [squads, setSquads] = useState<Squad[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSquadId, setActiveSquadId] = useState<number | null>(null);
  const [squadUsers, setSquadUsers] = useState<User[] | null>(null);

  // Fetch all squads for this member once on mount
  useEffect(() => {
    GymService
      .getUserSquads(3)
      .then(fetched => {
        console.log(fetched)
        setSquads(fetched);
      })
      .catch(err => {
        console.error("Failed to load squads:", err);
        setError("Sorry, we couldn’t load your groups.");
      });
  }, [memberId]);

  // Fetch squad members whenever active squad changes
  useEffect(() => {
    if (activeSquadId === null) return;

    GymService
      .getSquadUsers(activeSquadId)
      .then((members) => {
        console.log(members)
        setSquadUsers(members);
      })
      .catch((err) => {
        console.error("Failed to load squad users:", err);
        setSquadUsers(null);
      });
  }, [activeSquadId]);

  // While loading
  if (squads === null && error === null) {
    return <p>Loading your groups…</p>;
  }

  // If something went wrong
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  // If user has clicked into one, render that page
  const squad = squads!.find(s => s.id === activeSquadId);
  if (activeSquadId && squad && squadUsers) {
    return (
      <GroupsPage
        group={{
          id: squad.id,
          name: squad.squad_name,
          members: squadUsers,
        }}
        setActiveGroup={() => setActiveSquadId(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>

      {squads!.length === 0 ? (
        <p>You’re not in any groups yet.</p>
      ) : (
        <ul>
          {squads!.map(squad => (
            <li key={squad.id} className="py-2">
              <Button
                className="w-full"
                onClick={() => {
                  console.log("click!", squad.id);
                  setActiveSquadId(squad.id)}}
              >
                {squad.squad_name}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex mt-4">
        <Button
          variant="outline"
          className="w-1/2 mr-2"
          onClick={() => {/* open join dialog */}}
        >
          Join Group
        </Button>
        <Button
          variant="outline"
          className="w-1/2"
          onClick={() => {/* open create dialog */}}
        >
          Create Group
        </Button>
      </div>
    </div>
  );
}
