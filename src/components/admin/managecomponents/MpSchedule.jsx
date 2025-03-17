import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // ✅ ShadCN Toggle Switch
import { FaTrashAlt } from "react-icons/fa";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const times = Array.from({ length: 24 * 6 }, (_, i) => {
  const hours = Math.floor(i / 6);
  const minutes = (i % 6) * 10;
  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
});

const MpSchedule = ({ schedule = [], setSchedule }) => {
  const [localSchedule, setLocalSchedule] = useState({});

  useEffect(() => {
    if (!Array.isArray(schedule)) {
      console.error("⚠️ Schedule is not an array:", schedule);
      return;
    }

    const updatedSchedule = {};
    daysOfWeek.forEach((day) => {
      const foundDay = schedule.find((s) => s.day === day);
      updatedSchedule[day] = foundDay ? { time: foundDay.time, fixed: foundDay.fixed } : { time: "", fixed: true };
    });

    setLocalSchedule(updatedSchedule);
  }, [schedule]);

  const handleTimeChange = (day, value) => {
    setLocalSchedule((prev) => ({
      ...prev,
      [day]: { time: value, fixed: true },
    }));

    setSchedule((prev) => {
      const updated = prev.filter((s) => s.day !== day);
      return value ? [...updated, { day, time: value, fixed: true }] : updated;
    });
  };

  const toggleSpontaneous = (day, checked) => {
    setLocalSchedule((prev) => ({
      ...prev,
      [day]: checked ? { time: "Spontaneous", fixed: false } : { time: "", fixed: true },
    }));

    setSchedule((prev) => {
      const updated = prev.filter((s) => s.day !== day);
      return checked ? [...updated, { day, time: "Spontaneous", fixed: false }] : updated;
    });
  };

  const clearDay = (day) => {
    setLocalSchedule((prev) => ({
      ...prev,
      [day]: { time: "", fixed: true },
    }));

    setSchedule((prev) => prev.filter((s) => s.day !== day));
  };

  return (
    <Card className="bg-gray-800 border border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-purple-400 text-lg">Streaming Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-3">
          Select a time from the dropdown or toggle <span className="text-yellow-400">Spontaneous</span> mode.
        </p>
        <p className="text-gray-400 text-xs mt-1 mb-3">
            🔹 Times automatically convert to EST and are based on CEST. 
          </p>
          <p className="text-gray-400 text-xs mt-1 mb-3">
            🔹 Deleting makes it a "No Stream" day. 
          </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2">
              {/* Day Label */}
              <span className="w-24 font-semibold">{day}:</span>

              {/* Time Dropdown */}
              <select
                value={localSchedule[day]?.fixed ? localSchedule[day]?.time || "" : ""}
                onChange={(e) => handleTimeChange(day, e.target.value)}
                disabled={!localSchedule[day]?.fixed}
                className={`flex-1 bg-gray-700 text-white border-gray-600 rounded px-2 py-1 ${
                  !localSchedule[day]?.fixed && "opacity-50 cursor-not-allowed"
                }`}
              >
                <option value="">No Stream</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              {/* Spontaneous Toggle with "ON" Text */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={!localSchedule[day]?.fixed}
                  onCheckedChange={(checked) => toggleSpontaneous(day, checked)}
                  className="ml-2"
                />
                {!localSchedule[day]?.fixed && (
                  <span className="text-yellow-400 font-semibold">ON</span>
                )}
              </div>

              {/* Clear Day Button */}
              <Button size="icon" variant="ghost" onClick={() => clearDay(day)} className="ml-2">
                <FaTrashAlt className="text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MpSchedule;