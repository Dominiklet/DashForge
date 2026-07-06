import "./WidgetBase.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";
import { useDataSource } from "../context/useDataSource";

interface TextWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  dataSourceId: string;
}

export function TextWidget({
  title,
  panelStyle,
  showPanelBar,
  dataSourceId,
}: TextWidgetProps) {
  const source = useDataSource(dataSourceId);
  const code = source?.type === "markdown" ? source.code : "";

  return (
    <WidgetBase
      title={title}
      panelStyle={panelStyle}
      showPanelBar={showPanelBar}
      hasData={!!code}>
      <div className="widget-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{code}</ReactMarkdown>
      </div>
    </WidgetBase>
  );
}
