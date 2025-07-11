import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200";

  const variantStyles = {
    primary: disabled
      ? "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30",
    secondary: disabled
      ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};
