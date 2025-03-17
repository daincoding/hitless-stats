import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MpInfo = ({ name, setName, avatar, setAvatar, description, setDescription }) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isValidSize, setIsValidSize] = useState(true);

  // ✅ Validate image file type
  const isValidImageUrl = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  // ✅ Check image dimensions
  const checkImageSize = (url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setIsValidSize(img.width >= 250 && img.height >= 250);
    };
    img.onerror = () => setIsValidSize(false);
  };

  // ✅ Handle avatar URL changes
  const handleAvatarChange = (e) => {
    const url = e.target.value;
    setAvatar(url);

    // ✅ Validate file type
    const validImage = isValidImageUrl(url);
    setIsValidUrl(validImage);

    // ✅ If valid, check image size
    if (validImage) {
      checkImageSize(url);
    } else {
      setIsValidSize(true); // Prevent size errors if URL is invalid
    }
  };

  // ✅ Handle description character limit
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

        {/* ✅ Avatar URL Input & Live Preview */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-300 mb-1">Avatar URL:</label>
          <Input
            placeholder="Enter avatar URL (JPG, PNG, GIF, WEBP)"
            value={avatar}
            onChange={handleAvatarChange}
            className={`text-white w-full bg-gray-700 border px-3 py-2 rounded-md ${
              isValidUrl ? "border-gray-600" : "border-red-500"
            }`}
          />
          {!isValidUrl && (
            <p className="text-red-400 text-xs mt-1">⚠️ Please enter a valid image URL (.jpg, .png, .gif, .webp)</p>
          )}
          {!isValidSize && (
            <p className="text-red-400 text-xs mt-1">⚠️ Image must be at least 250x250 pixels</p>
          )}
          <p className="text-gray-400 text-xs mt-1">
            🔹 We recommend using <a href="https://imgur.com/upload" target="_blank" className="text-purple-400 underline">Imgur</a> to upload your avatar. Right click on the picture and get the link.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            🔹 Picture has to be at least 250x250 and has to end on .jpg, .png, .gif or .webp. 
          </p>
          <p className="text-gray-400 text-xs mt-1">
            🔹 Make sure you have the rights to use the picture! 
          </p>
          {avatar && isValidUrl && isValidSize && (
            <img src={avatar} alt="Avatar Preview" className="mt-2 w-20 h-20 rounded-full object-cover border border-gray-500" />
          )}
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