import React, { useState, useEffect } from "react";
import axios from "axios";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { LuPill } from "react-icons/lu";

const Medicamentos = () => {
    const [medicamentos, setMedicamentos] = useState([]);

    useEffect(() => {
        // Fetch medicamentos data from backend
        axios
            .get("http://localhost:30081/medicamentos")
            .then((response) => {
                setMedicamentos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar medicamentos:", error);
            });
    }, [medicamentos]);

    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "descricao", label: "Descrição", type: "text" },
        {
            id: "restricao_hospitalar",
            label: "Restricão Hospitalar",
            type: "text",
        },
        { id: "preco_minimo", label: "Preco Mínimo", type: "text" },
        { id: "preco_maximo", label: "Preço Máximo", type: "text" },
        { id: "codigo_anvisa", label: "Código ANVISA", type: "text" },
        // Adicione outros campos conforme necessário
    ];

    const handleAdd = (newItem) => {
        axios
            .post("http://localhost:30081/medicamentos", newItem)
            .then((response) => {
                setMedicamentos([...medicamentos, response.data]);
            })
            .catch((error) => {
                console.error("Erro ao adicionar medicamento:", error);
            });
    };

    const handleEdit = (id, updatedItem) => {
        axios
            .put(`http://localhost:30081/medicamentos/${id}`, updatedItem)
            .then((response) => {
                setMedicamentos(
                    medicamentos.map((item) =>
                        item.id === id ? response.data : item
                    )
                );
            })
            .catch((error) => {
                console.error("Erro ao atualizar medicamento:", error);
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:30081/medicamentos/${id}`)
            .then(() => {
                setMedicamentos(medicamentos.filter((item) => item.id !== id));
            })
            .catch((error) => {
                console.error("Erro ao deletar medicamento:", error);
            });
    };

    const sortedMedicamentos = medicamentos
        .sort((a, b) => a.id_medicamento - b.id_medicamento)
        .map((item) => ({
            ...item,
            preco_minimo: `R$${parseFloat(item.preco_minimo).toFixed(2)}`,
            preco_maximo: `R$${parseFloat(item.preco_maximo).toFixed(2)}`,
            restricao_hospitalar: `${
                item.restricao_hospitalar === "Não" ? "❌ Não" : "✅ Sim"
            }`,
        }));

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
        </TemplatePage>
    );
};

export default Medicamentos;
