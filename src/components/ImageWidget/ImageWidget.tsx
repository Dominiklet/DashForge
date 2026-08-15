import type { Panel } from "../../types/layout.ts";
import type { ImagePanelConfiguration } from "../../types/PanelConfigurationTypes/PanelConfiguration.ts";
import type {TimeData} from "../../types/TimeData.ts";
import {useContext} from "react";
import {DataContext} from "../../Context/DataContext.tsx";
import type {ImageData} from "../../types/DataTypes/ImageData.ts";
import "./ImageWidget.css";

interface ImageWidgetProps {
    panel: Panel;
}

const alignmentClassMap: Record<
    ImagePanelConfiguration["alignment"],
    string
> = {
    SCALED_TO_PANEL_SIZE: "image-scaled",
    ORIGINAL_SIZE: "image-original",
    CENTERED: "image-centered",
};

export function ImageWidget({ panel }: ImageWidgetProps) {
    const dataContext: TimeData | undefined =
        useContext(DataContext);

    const outputId =
        Object.values(panel.dataSourceOutputs)[0]?.outputId;

    const imageData = outputId
        ? (dataContext?.[outputId] as ImageData | undefined)
        : undefined;

    const panelConfiguration =
        panel.panelConfiguration as ImagePanelConfiguration;

    return (
        <div className="widget-image">
            {imageData?.base64 && (
                <img
                    src={imageData.base64}
                    alt={panel.title}
                    className={alignmentClassMap[panelConfiguration.alignment]}
                />
            )}
        </div>
    );
}
