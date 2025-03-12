import { Input } from "@/components/ui/input";

const MpCompleted = ({ completedRuns, setCompletedRuns, completedMarathons, setCompletedMarathons }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-purple-400">Completed Runs</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ Single Runs */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">Single Runs:</label>
          <Input
            type="number"
            placeholder="Completed Runs"
            value={completedRuns}
            onChange={(e) => setCompletedRuns(e.target.value)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
        </div>

        {/* ✅ Marathon Runs */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">Marathon Runs:</label>
          <Input
            type="number"
            placeholder="Completed Marathons"
            value={completedMarathons}
            onChange={(e) => setCompletedMarathons(e.target.value)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default MpCompleted;