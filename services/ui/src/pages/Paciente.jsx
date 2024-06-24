import React, { useState, useEffect } from "react";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { HiUserGroup } from "react-icons/hi";
import axios from "axios";

const Paciente = () => {
    const [paciente, setPaciente] = useState([]);

    const fields = [
        { id: "id_paciente", label: "ID", type: "number" },
        { id: "nome", label: "Nome", type: "text" },
        { id: "cpf", label: "CPF", type: "text" },
        { id: "data_nascimento", label: "Data de Nascimento", type: "date" },
        { id: "endereco", label: "Endereço", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
    ];

    useEffect(() => {
        fetchPacientes();
    }, [paciente]);

    const fetchPacientes = async () => {
        try {
            const response = await axios.get(
                "http://localhost:30081/pacientes"
            );
            setPaciente(response.data);
        } catch (error) {
            console.error("Erro ao buscar pacientes:", error);
        }
    };

    const handleAdd = async (newItem) => {
        try {
            const response = await axios.post(
                "http://localhost:30081/pacientes",
                newItem
            );
            setPaciente([...paciente, response.data]);
        } catch (error) {
            console.error("Erro ao adicionar paciente:", error);
        }
    };

    const handleEdit = async (id, updatedItem) => {
        try {
            const response = await axios.put(
                `http://localhost:30081/pacientes/${id}`,
                updatedItem
            );
            setPaciente(
                paciente.map((item) =>
                    item.id === id ? { ...item, ...response.data } : item
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar paciente:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:30081/pacientes/${id}`);
            setPaciente(paciente.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Erro ao deletar paciente:", error);
        }
    };

    return (
        <TemplatePage title="Pacientes" icon={<HiUserGroup />}>
            <TemplateDataDisplay
                fields={fields}
                data={paciente}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getId={(item) => item.id_paciente}
            />
        </TemplatePage>
    );
};

export default Paciente;
