import type {PanelData} from "./PanelData.ts";

export interface MarkDownData extends PanelData{
  title: string,
  content: string
}