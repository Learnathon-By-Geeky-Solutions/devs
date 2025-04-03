import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { UseFormRegister, RegisterOptions, FieldValues } from 'react-hook-form';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
  error?: string;
  register?: UseFormRegister<FieldValues>;
  registerOptions?: RegisterOptions;
  rightElement?: React.ReactNode;
  delay?: number;
}

export function FormInput({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  error,
  register,
  registerOptions,
  rightElement,
  delay = 0.5,
}: FormInputProps) {
  const errorId = `${id}-error`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-2"
    >
      <div className={rightElement ? 'flex items-center justify-between' : ''}>
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {rightElement}
      </div>
      <div className="relative group">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...(register ? register(id, registerOptions) : {})}
          className={`flex h-12 w-full rounded-md border ${
            error ? 'border-destructive' : 'border-input/50'
          } bg-background/50 py-3 pl-10 pr-4 text-sm ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-primary/50`}
        />
        <Icon className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/80 group-hover:text-primary transition-colors duration-200" />
      </div>
      {error && (
        <p id={errorId} className="text-destructive text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </motion.div>
  );
}
