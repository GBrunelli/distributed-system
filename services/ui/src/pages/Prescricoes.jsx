import React, { useState } from "react";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";

const Prescricoes = () => {
    const [prescricoes, setPrescricoes] = useState([]);

    const fields = [
        { id: "pacienteId", label: "ID do Paciente", type: "number" },
        { id: "medicoId", label: "ID do Médico", type: "number" },
        { id: "dataPrescricao", label: "Data da Prescrição", type: "date" },
    ];

    const handleAdd = (newItem) => {
        setPrescricoes([...prescricoes, { ...newItem, id: Date.now() }]);
    };

    const handleEdit = (id, updatedItem) => {
        setPrescricoes(
            prescricoes.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        );
    };

    const handleDelete = (id) => {
        setPrescricoes(prescricoes.filter((item) => item.id !== id));
    };

    return (
        <TemplatePage title="Prescrições" icon={<BsFileEarmarkMedicalFill />}>
            <TemplateDataDisplay
                fields={fields}
                data={prescricoes}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </TemplatePage>
    );
};

export default Prescricoes;
