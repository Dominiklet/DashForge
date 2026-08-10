import ReactMarkdown from "react-markdown";
import "./TextWidget.css";
import rehypeRaw from "rehype-raw";
import type {Panel} from "../../types/layout.ts";
import type {TextPanelConfiguration} from "../../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface TextWidgetProps {
  panel: Panel;
}

export function TextWidget({ panel }: TextWidgetProps) {
  const panelConfiguration = panel.panelConfiguration as TextPanelConfiguration

  return (
      <div className="widget-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{panelConfiguration.code}</ReactMarkdown>
      </div>
  );
}
