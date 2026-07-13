import type {PanelData} from "./PanelData.ts";

export interface KpiData extends PanelData{
  value: number,
  unit: string
}