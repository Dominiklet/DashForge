import type {PanelData} from "./PanelData.ts";

export interface TimeSeries extends PanelData{
  data: DataPoint[]
}

export interface DataPoint {
  timestamp: number,
  value: number
}