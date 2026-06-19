import type { PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";

type ImageAlignment = "SCALED_TO_PANEL_SIZE" | "ORIGINAL_SIZE" | "CENTERED";

interface ImageWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  imageSrc: string;
  alignment?: ImageAlignment;
}

const alignmentClassMap: Record<ImageAlignment, string> = {
  SCALED_TO_PANEL_SIZE: "image-scaled",
  ORIGINAL_SIZE: "image-original",
  CENTERED: "image-centered",
};

export function ImageWidget({
  title,
  panelStyle,
  showPanelBar,
  imageSrc,
  alignment = "SCALED_TO_PANEL_SIZE",
}: ImageWidgetProps) {
  return (
    <WidgetBase
      title={title}
      panelStyle={panelStyle}
      showPanelBar={showPanelBar}
      hasData={!!imageSrc}>
      <div className="widget-image">
        <img
          src={imageSrc}
          alt={title}
          className={alignmentClassMap[alignment]}
        />
      </div>
    </WidgetBase>
  );
}
