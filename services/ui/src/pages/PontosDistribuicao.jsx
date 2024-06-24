import React, { useState, useEffect } from "react";
import axios from "axios";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { FaMapMarkedAlt } from "react-icons/fa";

const PontosDistribuicao = () => {
    const [pontosDistribuicao, setPontosDistribuicao] = useState([]);

    const fields = [
        { id: "id_ponto", label: "Ponto ID", type: "number" },
        { id: "nome", label: "Nome", type: "text" },
        { id: "tipo", label: "Tipo", type: "text" },
        { id: "endereco", label: "Endereço", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
    ];

    useEffect(() => {
        axios
            .get("http://localhost:30081/pontos-distribuicao")
            .then((response) => {
                setPontosDistribuicao(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar pontos de distribuição:", error);
            });
    }, [pontosDistribuicao]);

    const handleAdd = (newItem) => {
        axios
            .post("http://localhost:30081/pontos-distribuicao", newItem)
            .then((response) => {
                setPontosDistribuicao([...pontosDistribuicao, response.data]);
            })
            .catch((error) => {
                console.error(
                    "Erro ao adicionar ponto de distribuição:",
                    error
                );
            });
    };

    const handleEdit = (id, updatedItem) => {
        axios
            .put(
                `http://localhost:30081/pontos-distribuicao/${id}`,
                updatedItem
            )
            .then((response) => {
                setPontosDistribuicao(
                    pontosDistribuicao.map((item) =>
                        item.id === id ? response.data : item
                    )
                );
            })
            .catch((error) => {
                console.error(
                    "Erro ao atualizar ponto de distribuição:",
                    error
                );
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:30081/pontos-distribuicao/${id}`)
            .then(() => {
                setPontosDistribuicao(
                    pontosDistribuicao.filter((item) => item.id !== id)
                );
            })
            .catch((error) => {
                console.error("Erro ao deletar ponto de distribuição:", error);
            });
    };

    return (
        <TemplatePage title="Pontos de Distribuição" icon={<FaMapMarkedAlt />}>
            <TemplateDataDisplay
                fields={fields}
                data={pontosDistribuicao}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getId={(item) => item.id_ponto}
            />
        </TemplatePage>
    );
};

export default PontosDistribuicao;
