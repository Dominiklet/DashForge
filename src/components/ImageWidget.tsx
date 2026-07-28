import "./WidgetBase.css";
import type { PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";

interface ImageWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  imageName: string;
  alignment?: "SCALED_TO_PANEL_SIZE" | "ORIGINAL_SIZE" | "CENTERED";
  alt?: string;
}

export function ImageWidget({
  title,
  panelStyle,
  imageName,
  alignment = "SCALED_TO_PANEL_SIZE",
  alt = "",
}: ImageWidgetProps) {
  const imageSrc = `${import.meta.env.BASE_URL}${imageName}`;

  const imageClassName =
    alignment === "SCALED_TO_PANEL_SIZE"
      ? "image-scaled"
      : alignment === "ORIGINAL_SIZE"
        ? "image-original"
        : "image-centered";

  return (
    <WidgetBase
      title={title}
      panelStyle={panelStyle}
      showPanelBar={false}
      hasData={!!imageName}>
      <div className="widget-image">
        <img src={imageSrc} alt={alt || title} className={imageClassName} />
      </div>
    </WidgetBase>
  );
}
