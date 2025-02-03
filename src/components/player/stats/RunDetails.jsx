import SingleRunDetails from "./SingleRunDetails";
import MarathonRunDetails from "./MarathonRunDetails";

const RunDetails = ({ run }) => {
  return run.type === "Marathon" ? <MarathonRunDetails run={run} /> : <SingleRunDetails run={run} />;
};

export default RunDetails;
