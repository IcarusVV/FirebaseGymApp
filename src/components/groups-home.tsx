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

    const GroupButton = ({ groupName }: { groupName: string }) => (
        <Button className="w-full" onClick={() => setActiveGroup(groupName)}>{groupName}</Button>
    );

  if (activeGroup) {
    const group = groups.find((g) => g.name === activeGroup);
    if (group) {
      return <GroupsPage group={group} setActiveGroup={setActiveGroup} />;
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
      <ul>
        {groups.map((group) => (
          <li key={group.name} className="py-2">
            <GroupButton groupName={group.name} />
          </li>
        ))}
      </ul>
        <div className="flex mt-4">
            <Button variant="outline" className="w-1/2 mr-2">Join Group</Button>
            <Button variant="outline" className="w-1/2">Create Group</Button>
        </div>
    </div>
  );

}


