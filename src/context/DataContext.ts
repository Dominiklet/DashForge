import { createContext } from "react";
import type { DataPoint } from "../types/panel";

export interface TimeseriesMetadata {
  name: string;
  unit: string | null;
  startDate: string;
  endDate: string;
  timeZone: string;
  annotations: unknown[];
}

export interface TimeseriesSource {
  type: "timeseries";
  data: DataPoint[];
  metadata: TimeseriesMetadata;
}

export interface MarkdownSource {
  type: "markdown";
  code: string;
}

export type DataSource = TimeseriesSource | MarkdownSource;

export type DataSources = Record<string, DataSource>;

export const DataContext = createContext<DataSources | null>(null);
