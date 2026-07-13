import "./WidgetBase.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { PanelStyle } from "../types/panel";
import { WidgetBase } from "./WidgetBase";

interface TextWidgetProps {
  title: string;
  panelStyle?: Partial<PanelStyle>;
  showPanelBar: boolean;
  code: string;
}

export function TextWidget({
                             title,
                             panelStyle,
                             showPanelBar,
                             code,
                           }: TextWidgetProps) {
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
