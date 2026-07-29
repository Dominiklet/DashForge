import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {WidgetBase} from "./WidgetBase";
import type {Panel} from "../types/layout.ts";
import type {TextPanelConfiguration} from "../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface TextWidgetProps {
  panel: Panel;
}

export function TextWidget({ panel }: TextWidgetProps) {
  const panelConfiguration = panel.panelConfiguration as TextPanelConfiguration

  return (
    <WidgetBase panel={panel} hasData={!!panelConfiguration.code}>
      <div className="widget-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{panelConfiguration.code}</ReactMarkdown>
      </div>
    </WidgetBase>
  );
}
