"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import PersonalPage from "@/components/personal-page";
import GroupsPage from "@/components/groups-page";
import SettingsPage from "@/components/settings-page";
import { GymContextProvider } from "@/context/gym-context";
import GroupsHome from "@/components/groups-home";
import { UserIcon, SquadsIcon, SettingsIcon } from "@/lib/icons";

const tabs = [
  { 
    name: "Personal", 
    icon: UserIcon, 
    component: PersonalPage 
  },
  { 
    name: "Groups", 
    icon: SquadsIcon, 
    component: GroupsHome 
  },
  { 
    name: "Settings", 
    icon: SettingsIcon, 
    component: SettingsPage 
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Personal");

  const TabComponent = tabs.find((tab) => tab.name === activeTab)?.component || PersonalPage;

  return (
    <GymContextProvider>
      <div className="flex flex-col h-screen">
        {/* Page Content */}
        <div className="flex-1 p-4">
          <TabComponent />
        </div>

        {/* Bottom Navigation - Icon Only */}
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
                    "flex items-center justify-center rounded-md p-2 w-full h-full",
                    activeTab === tab.name
                      ? "text-primary"
                      : "hover:bg-[hsla(300,100%,50%,0.5)] hover:text-foreground/80"
                  )}
                  onClick={() => setActiveTab(tab.name)}
                  aria-label={tab.name}
                >
                  <div className="h-10 w-10 flex items-center justify-center">
                    <tab.icon className="h-full w-full" />
                  </div>
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