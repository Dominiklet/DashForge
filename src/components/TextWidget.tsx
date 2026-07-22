import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useContext } from "react";
import { WidgetBase } from "./WidgetBase";
import type { Panel } from "../types/layout.ts";
import { DataContext } from "../Context/DataContext.tsx";
import type { TimeData } from "../types/TimeData.ts";
import type { MarkDownData } from "../types/DataTypes/MarkDownData.ts";
import type { TextPanelConfiguration } from "../types/PanelConfigurationTypes/PanelConfiguration.ts";

interface TextWidgetProps {
  panel: Panel;
  panelConfiguration: TextPanelConfiguration;
}

export function TextWidget({ panel }: TextWidgetProps) {
  const dataContext: TimeData | undefined = useContext(DataContext);
  const outputId = Object.values(panel.dataSourceOutputs)[0]?.outputId;
  const markdownData = outputId ? (dataContext?.[outputId] as MarkDownData | undefined) : undefined;
  const code = markdownData?.content;

  return (
    <WidgetBase panel={panel} hasData={!!code}>
      <div className="widget-markdown">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{code}</ReactMarkdown>
      </div>
    </WidgetBase>
  );
}
