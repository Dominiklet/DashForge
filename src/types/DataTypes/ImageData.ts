import type { PanelData } from "./PanelData.ts";

export interface ImageData extends PanelData {
  id: string;
  base64: string;
}
