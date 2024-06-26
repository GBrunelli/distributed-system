import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setPontosDistribuicao,
    addPontoDistribuicao,
    editPontoDistribuicao,
    deletePontoDistribuicao,
} from "../store";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { FaMapMarkedAlt } from "react-icons/fa";
import axios from "axios";

const PontosDistribuicao = () => {
    const dispatch = useDispatch();
    const pontosDistribuicao = useSelector((state) => state.pontosDistribuicao);
    const [loading, setLoading] = useState(true);

    const fields = [
        { id: "id_ponto", label: "Ponto ID", type: "number" },
        { id: "nome", label: "Nome", type: "text" },
        { id: "tipo", label: "Tipo", type: "text" },
        { id: "endereco", label: "Endereço", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
    ];

    useEffect(() => {
        fetchPontosDistribuicao();
    }, []);

    const fetchPontosDistribuicao = async () => {
        try {
            const response = await axios.get(
                "http://localhost:30081/pontos-distribuicao"
            );
            dispatch(setPontosDistribuicao(response.data));
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar pontos de distribuição:", error);
            setLoading(false);
        }
    };

    const handleAdd = async (newItem) => {
        try {
            const response = await axios.post(
                "http://localhost:30081/pontos-distribuicao",
                newItem
            );
            dispatch(addPontoDistribuicao(response.data));
        } catch (error) {
            console.error("Erro ao adicionar ponto de distribuição:", error);
        }
    };

    const handleEdit = async (id, updatedItem) => {
        try {
            const response = await axios.put(
                `http://localhost:30081/pontos-distribuicao/${id}`,
                updatedItem
            );
            dispatch(editPontoDistribuicao(response.data));
        } catch (error) {
            console.error("Erro ao atualizar ponto de distribuição:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:30081/pontos-distribuicao/${id}`
            );
            dispatch(deletePontoDistribuicao(id));
        } catch (error) {
            console.error("Erro ao deletar ponto de distribuição:", error);
        }
    };

    const sortedPontos = [...pontosDistribuicao].sort(
        (a, b) => a.id_ponto - b.id_ponto
    );

    return (
        <TemplatePage title="Pontos de Distribuição" icon={<FaMapMarkedAlt />}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <TemplateDataDisplay
                    fields={fields}
                    data={sortedPontos}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    getId={(item) => item.id_ponto}
                />
            )}
        </TemplatePage>
    );
};

export default PontosDistribuicao;
