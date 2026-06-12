import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

import type React from "react";

type InputFieldProps<T extends FieldValues> = {
  name?: Path<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "time" | "date";
  register?: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  children?: React.ReactNode;
  inputClassName?: string;
  value?: string | number;
  readOnly?: boolean;
};

function InputField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  register,
  errors,
  children,
  inputClassName = "",
  value = "",
  readOnly = false,
}: InputFieldProps<T>) {
  const registerProps = register && name ? register(name) : {};

  // ---------------- GET ERROR ----------------
  const getError = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  const fieldError = errors && name ? getError(errors, name) : null;

  return (
    <div>
      {/* LABEL */}
      {label && (
        <label
          className="
            text-xs
            font-semibold
            tracking-wide
            text-[var(--clay)]
          "
        >
          {label}
        </label>
      )}

      {/* INPUT */}
      <input
        type={type}
        readOnly={readOnly}
        {...registerProps}
        {...(readOnly ? { value } : {})}
        placeholder={placeholder}
        className={`
          mt-2
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-[rgba(196,99,42,0.2)]
          focus:outline-none
          focus:border-[var(--clay)]
          bg-white
          ${inputClassName}
        `}
      />

      {/* ERROR */}
      {fieldError?.message && (
        <p
          className="
            text-xs
            text-red-500
            mt-1
          "
        >
          {String(fieldError.message)}
        </p>
      )}

      {/* CHILDREN */}
      {children}
    </div>
  );
}

export default InputField;
