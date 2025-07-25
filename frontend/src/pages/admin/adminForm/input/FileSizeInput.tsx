// components/FileSizeInput.tsx
import { useState, useEffect } from "react";

interface FileSizeInputProps {
  /** Initial numeric value (without units) */
  initialSize?: number;
  /** Initial unit, either "KB" or "MB" */
  initialUnit?: "KB" | "MB";
  /** Placeholder for the number input */
  placeholder?: string;
  /**
   * Callback when either the number or the unit changes.
   * Receives an object: { size: number; unit: "KB" | "MB" }
   */
  onChange?: (value: { size: number; unit: "KB" | "MB" }) => void;
}

const FileSizeInput: React.FC<FileSizeInputProps> = ({
  initialSize = 0,
  initialUnit = "KB",
  placeholder = "e.g. 1024",
  onChange,
}) => {
  const [size, setSize] = useState<number>(initialSize);
  const [unit, setUnit] = useState<"KB" | "MB">(initialUnit);

  // Synchronize parent on mount & on every change
  useEffect(() => {
    onChange?.({ size, unit });
  }, [size, unit, onChange]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only allow numeric input
    const num = raw === "" ? 0 : parseFloat(raw);
    setSize(isNaN(num) ? 0 : num);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value as "KB" | "MB";
    setUnit(newUnit);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Numeric input */}
      <input
        type="number"
        min={0}
        step={unit === "MB" ? 0.01 : 1}
        value={size}
        onChange={handleSizeChange}
        placeholder={placeholder}
        className="w-full rounded-l-lg border border-gray-300 bg-transparent py-2 px-3 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />

      {/* Units dropdown */}
      <select
        value={unit}
        onChange={handleUnitChange}
        className="rounded-r-lg border border-gray-300 bg-transparent py-2 px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <option value="KB">KB</option>
        <option value="MB">MB</option>
      </select>
    </div>
  );
};

export default FileSizeInput;
