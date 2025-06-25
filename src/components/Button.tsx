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
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed",
    secondary:
      "bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-700 dark:disabled:text-gray-500",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};
