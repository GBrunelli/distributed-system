import React, { useState } from "react";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { FaUserDoctor } from "react-icons/fa6";

const Medicos = () => {
    const [medicos, setMedicos] = useState([]);

    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "crm", label: "CRM", type: "text" },
        { id: "especialidade", label: "Especialidade", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
        { id: "email", label: "Email", type: "email" },
    ];

    const handleAdd = (newItem) => {
        setMedicos([...medicos, { ...newItem, id: Date.now() }]);
    };

    const handleEdit = (id, updatedItem) => {
        setMedicos(
            medicos.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        );
    };

    const handleDelete = (id) => {
        setMedicos(medicos.filter((item) => item.id !== id));
    };

    return (
        <TemplatePage title="Médicos" icon={<FaUserDoctor />}>
            <TemplateDataDisplay
                fields={fields}
                data={medicos}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </TemplatePage>
    );
};

export default Medicos;
