"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import GroupsPage from "@/components/groups-page";

const arnoldWorshippersMembers = [
  { name: "Ben", id: "ben" },
  { name: "Ryan", id: "ryan" },
  { name: "Shaun", id: "shaun" },
  { name: "Mike", id: "mike" },
  { name: "Greg", id: "greg" },
];

const lightweightBabyMembers = [
    {name: "George", id: "george"},
    {name: "Muffin", id: "muffin"},
    {name: "Protein", id: "protein"},
    {name: "Ryan", id: "ryan"},
]

export default function GroupsHome() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = [
    { name: "Arnold Worshippers", members: arnoldWorshippersMembers },
    { name: "Lightweight Baby", members: lightweightBabyMembers },
  ];

  if (activeGroup) {
    const group = groups.find((g) => g.name === activeGroup);
    if (group) {
      return <GroupsPage group={group} />;
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.name} className="py-2">
            <Button onClick={() => setActiveGroup(group.name)}>{group.name}</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
