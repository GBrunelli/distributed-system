import React, { useState } from "react";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { FaHandHoldingMedical } from "react-icons/fa6";

const PontosDistribuicao = () => {
    const [pontosDistribuicao, setPontosDistribuicao] = useState([]);

    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "tipo", label: "Tipo", type: "text" },
        { id: "endereco", label: "Endereço", type: "text" },
        { id: "telefone", label: "Telefone", type: "text" },
    ];

    const handleAdd = (newItem) => {
        setPontosDistribuicao([
            ...pontosDistribuicao,
            { ...newItem, id: Date.now() },
        ]);
    };

    const handleEdit = (id, updatedItem) => {
        setPontosDistribuicao(
            pontosDistribuicao.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
            )
        );
    };

    const handleDelete = (id) => {
        setPontosDistribuicao(
            pontosDistribuicao.filter((item) => item.id !== id)
        );
    };

    return (
        <TemplatePage
            title="Pontos de Distribuição"
            icon={<FaHandHoldingMedical />}
        >
            <TemplateDataDisplay
                fields={fields}
                data={pontosDistribuicao}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </TemplatePage>
    );
};

export default PontosDistribuicao;
