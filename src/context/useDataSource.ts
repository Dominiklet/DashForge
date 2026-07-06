import { useContext } from "react";
import { DataContext } from "./DataContext";
import type { DataSource } from "./DataContext";

export function useDataSource(id: string): DataSource | undefined {
  const dataSources = useContext(DataContext);
  if (dataSources === null) {
    throw new Error("useDataSource muss innerhalb eines DataProvider verwendet werden");
  }
  return dataSources[id];
}
