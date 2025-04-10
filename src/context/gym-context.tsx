"use client";

import React, { createContext, useContext, useState } from 'react';

interface GymContextType {
  confirmedVisits: Date[];
  addVisit: (date: Date) => void;
  removeVisit: (date: Date) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirmedVisits, setConfirmedVisits] = useState<Date[]>([]);

  const addVisit = (date: Date) => {
    setConfirmedVisits([...confirmedVisits, date]);
  };

  const removeVisit = (date: Date) => {
    setConfirmedVisits(confirmedVisits.filter(visit => visit.getTime() !== date.getTime()));
  };

  const value: GymContextType = {
    confirmedVisits,
    addVisit,
    removeVisit,
  };

  return (
    <GymContext.Provider value={value}>
      {children}
    </GymContext.Provider>
  );
};

export const useGymContext = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error("useGymContext must be used within a GymContextProvider");
  }
  return context;
};
