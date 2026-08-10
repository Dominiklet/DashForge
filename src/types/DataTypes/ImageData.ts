import type { PanelData } from "./PanelData.ts";

export interface ImageData extends PanelData {
    base64: string;
}