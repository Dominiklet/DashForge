import type { ReactNode } from "react";
import { DataContext } from "./DataContext";
import type { DataSources } from "./DataContext";

interface DataProviderProps {
  dataSources: DataSources;
  children: ReactNode;
}

export function DataProvider({ dataSources, children }: DataProviderProps) {
  return (
    <DataContext.Provider value={dataSources}>{children}</DataContext.Provider>
  );
}
