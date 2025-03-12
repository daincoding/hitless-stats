import { Input } from "@/components/ui/input";
import { useState } from "react";

const MpSocials = ({ twitch, setTwitch, youtube, setYoutube, bluesky, setBluesky }) => {
  // State for validation errors
  const [errors, setErrors] = useState({ twitch: "", youtube: "", bluesky: "" });

  // 🔹 URL Validation
  const validateURL = (platform, value, setFunction) => {
    const patterns = {
      twitch: /^https?:\/\/(www\.)?twitch\.tv\/[\w-]+$/,
      youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel\/|c\/|user\/|@|watch\?v=)|youtu\.be\/)[\w-]+/,
      bluesky: /^https?:\/\/(www\.)?bsky\.app\/profile\/[\w.-]+$/,
    };

    if (!value || patterns[platform].test(value)) {
      setErrors((prev) => ({ ...prev, [platform]: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [platform]: `Invalid ${platform} URL`,
      }));
    }

    setFunction(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-purple-400">Social Links</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ Twitch URL */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">Twitch URL:</label>
          <Input
            type="url"
            placeholder="Enter Twitch URL (e.g., https://twitch.tv/username)"
            value={twitch}
            onChange={(e) => validateURL("twitch", e.target.value, setTwitch)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
          {errors.twitch && <p className="text-red-400 text-xs mt-1">{errors.twitch}</p>}
        </div>

        {/* ✅ YouTube URL */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">YouTube URL:</label>
          <Input
            type="url"
            placeholder="Enter YouTube URL (e.g., https://youtube.com/@username)"
            value={youtube}
            onChange={(e) => validateURL("youtube", e.target.value, setYoutube)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
          {errors.youtube && <p className="text-red-400 text-xs mt-1">{errors.youtube}</p>}
        </div>

        {/* ✅ Bluesky URL */}
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-semibold text-gray-300 mb-1">Bluesky URL:</label>
          <Input
            type="url"
            placeholder="Enter Bluesky URL (e.g., https://bsky.app/profile/username)"
            value={bluesky}
            onChange={(e) => validateURL("bluesky", e.target.value, setBluesky)}
            className="text-white w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md"
          />
          {errors.bluesky && <p className="text-red-400 text-xs mt-1">{errors.bluesky}</p>}
        </div>
      </div>
    </div>
  );
};

export default MpSocials;