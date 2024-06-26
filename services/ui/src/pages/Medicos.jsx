import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMedicos, addMedico, editMedico, deleteMedico } from "../store";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { FaUserDoctor } from "react-icons/fa6";

const Medicos = () => {
    const dispatch = useDispatch();
    const medicos = useSelector((state) => state.medicos);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:30081/medicos")
            .then((response) => {
                dispatch(setMedicos(response.data));
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erro ao buscar médicos:", error);
                setLoading(false);
            });
    }, [dispatch]);

    const handleAdd = (newItem) => {
        axios
            .post("http://localhost:30081/medicos", newItem)
            .then((response) => {
                dispatch(addMedico(response.data));
            })
            .catch((error) => {
                console.error("Erro ao adicionar médico:", error);
            });
    };

    const handleEdit = (id, updatedItem) => {
        axios
            .put(`http://localhost:30081/medicos/${id}`, updatedItem)
            .then((response) => {
                dispatch(editMedico(response.data));
            })
            .catch((error) => {
                console.error("Erro ao atualizar médico:", error);
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:30081/medicos/${id}`)
            .then(() => {
                dispatch(deleteMedico(id));
            })
            .catch((error) => {
                console.error("Erro ao deletar médico:", error);
            });
    };

    const fields = [
        { id: "id_medico", label: "ID", type: "number" },
        { id: "nome", label: "Nome", type: "text" },
        { id: "crm", label: "CRM", type: "text" },
        { id: "especialidade", label: "Especialidade", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
        { id: "email", label: "Email", type: "email" },
    ];

    const sortedMedicos = [...medicos].sort(
        (a, b) => a.id_medico - b.id_medico
    );

    return (
        <TemplatePage title="Médicos" icon={<FaUserDoctor />}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <TemplateDataDisplay
                    fields={fields}
                    data={sortedMedicos}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getId={(item) => item.id_medico}
                />
            )}
        </TemplatePage>
    );
};

export default Medicos;
