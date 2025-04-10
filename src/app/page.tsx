
"use client";

import { useState } from "react";
import { CalendarIcon, Users, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import PersonalPage from "@/components/personal-page";
import GroupsPage from "@/components/groups-page";
import SettingsPage from "@/components/settings-page";

const tabs = [
  { name: "Personal", icon: CalendarIcon, component: PersonalPage },
  { name: "Groups", icon: Users, component: GroupsPage },
  { name: "Settings", icon: Settings, component: SettingsPage },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Personal");

  const TabComponent = tabs.find((tab) => tab.name === activeTab)?.component || PersonalPage;

  return (
    <div className="flex flex-col h-screen">
      {/* Page Content */}
      <div className="flex-1 p-4">
        <TabComponent />
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-secondary border-t border-border">
        <div className="flex justify-around p-2">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center rounded-md p-2",
                activeTab === tab.name
                  ? "text-primary"
                  : "hover:text-foreground/80"
              )}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </Button>
          ))}
        </div>
      </nav>
      <Toaster />
    </div>
  );
}

