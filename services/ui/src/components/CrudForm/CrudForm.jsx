import React from "react";
import FormField from "../FormField/FormField";

const CrudForm = ({ fields, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="space-y-12">
                <div className="pb-12 border-b border-gray-900/10">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Formulário
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Preencha o formulário abaixo.
                    </p>

                    <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                        {fields.map((field) => (
                            <FormField key={field.id} {...field} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end mt-6 gap-x-6">
                <button
                    type="reset"
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Salvar
                </button>
            </div>
        </form>
    );
};

export default CrudForm;
