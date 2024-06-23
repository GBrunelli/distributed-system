import React, { useState, useEffect } from "react";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { FaUserDoctor } from "react-icons/fa6";
import axios from "axios";

const Paciente = () => {
    const [pacientes, setPacientes] = useState([]);

    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "crm", label: "CRM", type: "text" },
        { id: "especialidade", label: "Especialidade", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
        { id: "email", label: "Email", type: "email" },
    ];

    useEffect(() => {
        axios
            .get("http://localhost:30081/pacientes")
            .then((response) => {
                setPacientes(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar pacientes:", error);
            });
    }, []);

    const handleAdd = (newItem) => {
        setPacientes([...pacientes, { ...newItem, id: Date.now() }]);
    };

    const handleEdit = (id, updatedItem) => {
        setPacientes(
            pacientes.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        );
    };

    const handleDelete = (id) => {
        setPacientes(pacientes.filter((item) => item.id !== id));
    };

    return (
        <TemplatePage title="Pacientes" icon={<FaUserDoctor />}>
            <TemplateDataDisplay
                fields={fields}
                data={pacientes}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </TemplatePage>
    );
};

export default Paciente;
