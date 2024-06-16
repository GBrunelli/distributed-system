import React, { useState } from "react";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { LuPill } from "react-icons/lu";

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([
        {
            id: 1,
            nome: "Paracetamol",
            descricao: "Analgésico",
            fabricante: "Medley",
            dataRegistroAnvisa: "2021-05-01",
            codigoAnvisa: "123456",
        },
        {
            id: 2,
            nome: "Ibuprofeno",
            descricao: "Anti-inflamatório",
            fabricante: "Sanofi",
            dataRegistroAnvisa: "2021-06-15",
            codigoAnvisa: "654321",
        },
    ]);

    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "descricao", label: "Descrição", type: "text" },
        { id: "fabricante", label: "Fabricante", type: "text" },
        {
            id: "dataRegistroAnvisa",
            label: "Data de Registro ANVISA",
            type: "date",
        },
        { id: "codigoAnvisa", label: "Código ANVISA", type: "text" },
    ];

    const handleAdd = (newItem) => {
        setMedicamentos([...medicamentos, { ...newItem, id: Date.now() }]);
    };

    const handleEdit = (id, updatedItem) => {
        setMedicamentos(
            medicamentos.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        );
    };

    const handleDelete = (id) => {
        setMedicamentos(medicamentos.filter((item) => item.id !== id));
    };

    return (
        <TemplatePage title="Medicamentos" icon={<LuPill />}>
            <TemplateDataDisplay
                fields={fields}
                data={medicamentos}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </TemplatePage>
    );
};

export default Medicamentos;
