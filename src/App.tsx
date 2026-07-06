import titleData from "./templates/dashboard_template.json";
import strompreisData from "./mock data/strompreis.json";
import strompreisMeta from "./mock data/strompreis_metadata.json";
import markdownData from "./mock data/markdown.json";
import { Dashboard } from "./components/Dashboard";
import { DataProvider } from "./context/DataProvider";
import type { DataSources } from "./context/DataContext";

const dataSources: DataSources = {
  markdown: {
    type: "markdown",
    code: markdownData.panelConfiguration.code,
  },
  strompreis: {
    type: "timeseries",
    data: strompreisData,
    metadata: strompreisMeta,
  },
};

function App() {
  return (
    <DataProvider dataSources={dataSources}>
      <Dashboard
        name={titleData.name}
        explorerPath={titleData.nodeInformation.explorerPath}
        markdownTitle={markdownData.title}
        markdownDataSourceId="markdown"
        kpiTitle="Neues KPI"
        kpiDataSourceId="strompreis"
      />
    </DataProvider>
  );
}

export default App;
