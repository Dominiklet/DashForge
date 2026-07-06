import titleData from "./templates/dashboard_template.json";
import strompreisData from "./mock data/strompreis.json";
import strompreisMeta from "./mock data/strompreis_metadata.json";
import markdownData from "./mock data/markdown.json";
import { Dashboard } from "./components/Dashboard";

function App() {
  return (
    <Dashboard
      name={titleData.name}
      explorerPath={titleData.nodeInformation.explorerPath}
      markdownTitle={markdownData.title}
      markdownCode={markdownData.panelConfiguration.code}
      kpiTitle="Neues KPI"
      kpiData={strompreisData}
      kpiUnit={strompreisMeta.unit}
    />
  );
}

export default App;
