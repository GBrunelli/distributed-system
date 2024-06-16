import React from "react";

const CrudList = ({ items, fields }) => {
    return (
        <div className="space-y-12">
            <div className="pb-12 border-b border-gray-900/10">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Lista
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    Abaixo está a lista de itens.
                </p>

                <ul className="mt-10">
                    {items.map((item) => (
                        <li key={item.id} className="mt-4">
                            <div className="p-4 border rounded-md shadow-sm">
                                {fields.map((field) => (
                                    <p key={field.id}>
                                        <strong>{field.label}:</strong>{" "}
                                        {item[field.id]}
                                    </p>
                                ))}
                                <p>
                                    <strong>Data:</strong>{" "}
                                    {new Date(item.date).toLocaleDateString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CrudList;
