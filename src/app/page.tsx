
"use client";

import { useState } from "react";
import { CalendarIcon, Users, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import PersonalPage from "@/components/personal-page";
import GroupsPage from "@/components/groups-page";
import SettingsPage from "@/components/settings-page";
import { GymContextProvider } from "@/context/gym-context";

const tabs = [
  { name: "Personal", icon: CalendarIcon, component: PersonalPage },
  { name: "Groups", icon: Users, component: GroupsPage },
  { name: "Settings", icon: Settings, component: SettingsPage },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("Personal");

  const TabComponent = tabs.find((tab) => tab.name === activeTab)?.component || PersonalPage;

  return (
    <GymContextProvider>
      <div className="flex flex-col h-screen">
        {/* Page Content */}
        <div className="flex-1 p-4">
          <TabComponent />
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full bg-secondary border-t border-border" style={{ height: '5vh' }}>
          <div className="flex justify-around items-center h-full">
            {tabs.map((tab, index) => (
              <div key={tab.name} className="flex-1 flex items-center justify-center h-full">
                {index > 0 && (
                  <div className="h-5 border-l border-border"></div>
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md p-2 w-full h-full",
                    activeTab === tab.name
                      ? "text-primary"
                      : "hover:bg-[hsla(300,100%,50%,0.5)] hover:text-foreground/80"
                  )}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </Button>
              </div>
            ))}
          </div>
        </nav>
        <Toaster />
      </div>
    </GymContextProvider>
  );
}

