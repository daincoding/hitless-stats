import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MpInfo = ({ name, setName, avatar, setAvatar, description, setDescription }) => {
  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 190) {
      setDescription(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-purple-400">Player Info</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ Player Name */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">Player Name:</label>
          <Input
            placeholder="Enter player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
        </div>

        {/* ✅ Avatar URL */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">Avatar URL:</label>
          <Input
            placeholder="Enter avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
        </div>
      </div>

      {/* ✅ Description with Character Limit */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">Description (Max 190 Characters):</label>
        <Textarea
          placeholder="Enter player description..."
          value={description}
          onChange={handleDescriptionChange}
          className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
        />
        <p className="text-right text-xs text-gray-400 mt-1">{description.length}/190</p>
      </div>
    </div>
  );
};

export default MpInfo;