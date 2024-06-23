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
    }, []);

    const fields = [
        { id: "nome", label: "Nome", type: "text" },
        { id: "descricao", label: "Descrição", type: "text" },
        { id: "fabricante", label: "Fabricante", type: "text" },
        {
            id: "data_registro_anvisa",
            label: "Data de Registro ANVISA",
            type: "date",
        },
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

    return (
        <TemplatePage title="Medicamentos" icon={<LuPill />}>
            <TemplateDataDisplay
                fields={fields}
                data={medicamentos}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </TemplatePage>
    );
};

export default Medicamentos;
