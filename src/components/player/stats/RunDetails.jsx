import SingleRunDetails from "./SingleRunDetails";
import MarathonRunDetails from "./MarathonRunDetails";

const RunDetails = ({ run }) => {
  return run.type === "Marathon" ? <MarathonRunDetails run={run} /> : <SingleRunDetails run={run} />; // if run type is Marathon show MarathonRunDetails comp. otherwise SingleRun and we pass run details from fetched Data
};

export default RunDetails;
