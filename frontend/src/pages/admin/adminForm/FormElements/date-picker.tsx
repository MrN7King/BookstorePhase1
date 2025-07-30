//file: frontend/src/pages/admin/adminForm/FormElements/date-picker.tsx
import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
// Removed import for CalenderIcon, as we'll use Google Fonts icon

// You might need to adjust these imports if flatpickr types are causing issues without direct access to types.
// For a simple conversion, we can keep them but the main change is in the JSX.
type Hook = flatpickr.Options.Hook;
type DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    // Ensure that flatpickr is only initialized once for the given ID.
    // It's good practice to clear any existing instances if the component re-renders
    // with a different ID, though the current effect dependency array helps.
    const element = document.getElementById(id);
    if (!element) return; // Guard against element not being found

    const fpInstance = flatpickr(element, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
    });
    

    return () => {
      // Destroy the flatpickr instance when the component unmounts
      // to prevent memory leaks and ensure clean re-initialization.
      if (fpInstance && !Array.isArray(fpInstance)) { // flatpickr can return an array if initialized on multiple elements
        fpInstance.destroy();
      }
    };
  }, [id, mode, onChange, defaultDate]); // Dependencies for useEffect

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          {/* Replaced CalenderIcon with Google Material Symbols icon */}
          <span className="material-symbols-outlined size-6">
            calendar_month
          </span>
        </span>
      </div>
    </div>
  );
}