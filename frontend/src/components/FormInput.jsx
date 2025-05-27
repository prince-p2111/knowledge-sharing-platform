const FormInput = ({
  label,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  required = false,
  showCharCount = false,
  charCount = 0,
  minCharCount = 0,
  rows = 1,
}) => {
  const isTextarea = type === "textarea";

  return (
    <div className="mb-6">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && " *"}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          className={`block w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`block w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder={placeholder}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {showCharCount && (
        <p className="mt-1 text-xs text-gray-500">
          {charCount} characters (minimum {minCharCount} required)
        </p>
      )}
    </div>
  );
};

export default FormInput;
