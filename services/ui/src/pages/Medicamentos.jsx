import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    setMedicamentos,
    addMedicamento,
    editMedicamento,
    deleteMedicamento,
} from "../store";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { LuPill } from "react-icons/lu";
import { Button } from "flowbite-react";

const Medicamentos = () => {
    const dispatch = useDispatch();
    const medicamentos = useSelector((state) => state.medicamentos);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "descricao", label: "Descrição", type: "text" },
        {
            id: "restricao_hospitalar",
            label: "Restrição Hospitalar",
            type: "text",
        },
        { id: "preco_minimo", label: "Preço Mínimo", type: "text" },
        { id: "preco_maximo", label: "Preço Máximo", type: "text" },
        { id: "codigo_anvisa", label: "Código ANVISA", type: "text" },
        // Adicione outros campos conforme necessário
    ];

    useEffect(() => {
        fetchMedicamentos(currentPage);
    }, [currentPage]);

    const fetchMedicamentos = async (page) => {
        try {
            const response = await axios.get(
                `http://localhost:30081/medicamentos?limit=${itemsPerPage}&offset=${
                    page * itemsPerPage
                }`
            );
            if (page === 0) {
                dispatch(setMedicamentos(response.data));
            } else {
                dispatch(setMedicamentos([...medicamentos, ...response.data]));
            }
        } catch (error) {
            console.error("Erro ao buscar medicamentos:", error);
        }
    };

    const handleAdd = async (newItem) => {
        try {
            const response = await axios.post(
                "http://localhost:30081/medicamentos",
                newItem
            );
            dispatch(addMedicamento(response.data));
        } catch (error) {
            console.error("Erro ao adicionar medicamento:", error);
        }
    };

    const handleEdit = async (id, updatedItem) => {
        try {
            const response = await axios.put(
                `http://localhost:30081/medicamentos/${id}`,
                updatedItem
            );
            dispatch(editMedicamento(response.data));
        } catch (error) {
            console.error("Erro ao atualizar medicamento:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:30081/medicamentos/${id}`);
            dispatch(deleteMedicamento(id));
        } catch (error) {
            console.error("Erro ao deletar medicamento:", error);
        }
    };

    const sortedMedicamentos = [...medicamentos]
        .sort((a, b) => a.id_medicamento - b.id_medicamento)
        .map((item) => ({
            ...item,
            preco_minimo: `R$${parseFloat(item.preco_minimo).toFixed(2)}`,
            preco_maximo: `R$${parseFloat(item.preco_maximo).toFixed(2)}`,
            restricao_hospitalar: `${
                item.restricao_hospitalar === "Não" ? "❌ Não" : "✅ Sim"
            }`,
        }));

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    return (
        <TemplatePage title="Medicamentos" icon={<LuPill />}>
            <TemplateDataDisplay
                fields={fields}
                data={sortedMedicamentos}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getId={(item) => item.id_medicamento}
            />
            <div className="flex justify-end w-full px-16 py-8">
                <Button color="blue" onClick={handleNextPage}>
                    Carregar Mais
                </Button>
            </div>
        </TemplatePage>
    );
};

export default Medicamentos;
