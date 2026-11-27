"use client";

import { createContext, useContext } from "react";

// A new value starts chart entrance animations when the data view is shown again.
export const DashboardReplayContext = createContext(0);

export function useDashboardReplay() {
  return useContext(DashboardReplayContext);
}
