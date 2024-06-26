import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setPacientes,
    addPaciente,
    editPaciente,
    deletePaciente,
} from "../store";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { HiUserGroup } from "react-icons/hi";
import axios from "axios";

const Paciente = () => {
    const dispatch = useDispatch();
    const pacientes = useSelector((state) => state.pacientes);
    const [loading, setLoading] = useState(true);

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
    }, []);

    const fetchPacientes = async () => {
        try {
            const response = await axios.get(
                "http://localhost:30081/pacientes"
            );
            dispatch(setPacientes(response.data));
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar pacientes:", error);
            setLoading(false);
        }
    };

    const handleAdd = async (newItem) => {
        try {
            const response = await axios.post(
                "http://localhost:30081/pacientes",
                newItem
            );
            dispatch(addPaciente(response.data));
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
            dispatch(editPaciente(response.data));
        } catch (error) {
            console.error("Erro ao atualizar paciente:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:30081/pacientes/${id}`);
            dispatch(deletePaciente(id));
        } catch (error) {
            console.error("Erro ao deletar paciente:", error);
        }
    };

    const sortedPacientes = [...pacientes].sort(
        (a, b) => a.id_paciente - b.id_paciente
    );

    return (
        <TemplatePage title="Pacientes" icon={<HiUserGroup />}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <TemplateDataDisplay
                    fields={fields}
                    data={sortedPacientes}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getId={(item) => item.id_paciente}
                />
            )}
        </TemplatePage>
    );
};

export default Paciente;
