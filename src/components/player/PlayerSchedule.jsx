import { FaCheckCircle, FaQuestionCircle, FaTimesCircle } from "react-icons/fa";

// Convert CET to ET (-6h or -5h depending on daylight saving time)
const convertToET = (cetTime) => {
  if (cetTime.includes("Spontaneous") || cetTime.includes("No Stream")) return cetTime; 
  const [time, period] = cetTime.split(" "); 
  let [hours, minutes] = time.split(":").map(Number); 
  const isPM = period === "PM";

  // Convert to 24-hour format
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  // Convert to Eastern Time (ET)
  const offset = new Date().getTimezoneOffset() === -120 ? -6 : -5; // CET is UTC+1, CEST is UTC+2
  hours = (hours + offset + 24) % 24;

  // Convert back to 12-hour format
  const newPeriod = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12 for AM

  return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${newPeriod} ET`;
};

const PlayerSchedule = ({ schedule }) => {
  // Define the correct order (Monday to Sunday)
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Sort schedule based on predefined order
  const sortedSchedule = dayOrder.map((day) => {
    const entry = schedule.find((s) => s.day === day);
    return entry || { day, time: "No Stream", fixed: false }; // Default for missing days
  });

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Schedule</h2>
      <table className="w-full border border-[var(--color-primary)] rounded-lg shadow-lg text-[var(--color-text-light)]">
        <thead>
          <tr className="bg-[var(--color-dark)] text-[var(--color-primary)]">
            <th className="p-3 border border-[var(--color-primary)]">Day</th>
            <th className="p-3 border border-[var(--color-primary)]">CET (Germany)</th>
            <th className="p-3 border border-[var(--color-primary)]">ET (US)</th>
          </tr>
        </thead>
        <tbody>
          {sortedSchedule.map((day, index) => (
            <tr key={index} className="text-center">
              <td className="p-3 border border-[var(--color-primary)]">{day.day}</td>
              <td className="p-3 border border-[var(--color-primary)] flex items-center justify-center gap-2">
                {day.fixed ? <FaCheckCircle className="text-green-400" /> : day.time === "No Stream" ? <FaTimesCircle className="text-red-500" /> : <FaQuestionCircle className="text-yellow-400" />}
                {day.time}
              </td>
              <td className="p-3 border border-[var(--color-primary)] text-[var(--color-text-muted)]">
                {convertToET(day.time)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerSchedule;
