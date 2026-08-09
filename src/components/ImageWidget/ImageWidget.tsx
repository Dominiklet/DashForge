import type { Panel } from "../../types/layout.ts";
import type { ImagePanelConfiguration } from "../../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface ImageWidgetProps {
  panel: Panel;
}

const alignmentClassMap: Record<ImagePanelConfiguration["alignment"], string> = {
  SCALED_TO_PANEL_SIZE: "image-scaled",
  ORIGINAL_SIZE: "image-original",
  CENTERED: "image-centered",
};

export function ImageWidget({ panel }: ImageWidgetProps) {
  const panelConfiguration = panel.panelConfiguration as ImagePanelConfiguration;
  const imageSrc = `${import.meta.env.BASE_URL}${panelConfiguration.originalImageName}`;

  return (
      <div className="widget-image">
        <img
          src={imageSrc}
          alt={panel.title}
          className={alignmentClassMap[panelConfiguration.alignment]}
        />
      </div>
  );
}
