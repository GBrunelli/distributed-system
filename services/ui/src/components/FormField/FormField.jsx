import React from "react";

const FormField = ({ id, label, type, options, onChange }) => {
    if (type === "select") {
        return (
            <div className="sm:col-span-3">
                <label
                    htmlFor={id}
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    {label}
                </label>
                <div className="mt-2">
                    <select
                        id={id}
                        name={id}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        onChange={onChange}
                    >
                        <option value="">
                            Selecione {label.toLowerCase()}
                        </option>
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    // Other field types can be handled here (e.g., text, number)
    return null;
};

export default FormField;
