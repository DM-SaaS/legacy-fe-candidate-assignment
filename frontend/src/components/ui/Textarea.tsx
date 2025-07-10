import { TextareaHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "../../utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: "sm" | "md" | "lg";
  resize?: "none" | "vertical" | "horizontal" | "both";
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      size = "md",
      resize = "none",
      showCharCount = false,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(
      value ? String(value).length : 0
    );

    const sizes = {
      sm: "px-2.5 py-1.5 text-sm",
      md: "px-3 py-2",
      lg: "px-4 py-3 text-lg",
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCharCount) {
        setCharCount(e.target.value.length);
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full border border-gray-300 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "placeholder-gray-400 transition-colors",
            error && "border-red-500 focus:ring-red-500",
            sizes[size],
            resizeClasses[resize],
            className
          )}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          {(showCharCount || maxLength) && (
            <p
              className={cn(
                "text-xs",
                maxLength && charCount > maxLength * 0.9
                  ? "text-amber-600"
                  : "text-gray-400"
              )}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
