import type { FC } from "react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "xs" | "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "destruction" | "lightDestruction"; // Button variant
  type?: "button" | "submit" | "reset"; // Add this line
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes for styling
}

const Button: FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  type = "button",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    xs: "px-2.5 py-0.5 text-xs font-medium",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm md:px-5 md:py-3.5",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    destruction:
      "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    lightDestruction:
      "focus:outline-none bg-error-50 hover:bg-red-600 hover:text-white text-error-600 dark:bg-error-500/15 dark:text-error-500",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};

export default Button;