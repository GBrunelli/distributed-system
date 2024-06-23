import React, { useState, useEffect } from "react";
import axios from "axios";
import TemplatePage from "./TemplatePage";
import TemplateDataDisplay from "./TemplateDataDisplay";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";

const Prescricoes = () => {
    const [prescricoes, setPrescricoes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Número de itens por página

    const fields = [
        { id: "paciente", label: "ID do Paciente", type: "number" },
        { id: "medico", label: "ID do Médico", type: "number" },
        { id: "data_prescricao", label: "Data da Prescrição", type: "date" },
    ];

    useEffect(() => {
        axios
            .get("http://localhost:30081/prescricoes")
            .then((response) => {
                setPrescricoes(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar prescrições:", error);
            });
    }, []);

    const handleAdd = (newItem) => {
        axios
            .post("http://localhost:30081/prescricoes", newItem)
            .then((response) => {
                setPrescricoes([...prescricoes, response.data]);
            })
            .catch((error) => {
                console.error("Erro ao adicionar prescrição:", error);
            });
    };

    const handleEdit = (id, updatedItem) => {
        axios
            .put(`http://localhost:30081/prescricoes/${id}`, updatedItem)
            .then((response) => {
                setPrescricoes(
                    prescricoes.map((item) =>
                        item.id_prescricao === id ? response.data : item
                    )
                );
            })
            .catch((error) => {
                console.error("Erro ao atualizar prescrição:", error);
            });
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:30081/prescricoes/${id}`)
            .then(() => {
                setPrescricoes(
                    prescricoes.filter((item) => item.id_prescricao !== id)
                );
            })
            .catch((error) => {
                console.error("Erro ao deletar prescrição:", error);
            });
    };

    // Lógica de paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = prescricoes.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <TemplatePage title="Prescrições" icon={<BsFileEarmarkMedicalFill />}>
            <TemplateDataDisplay
                fields={fields}
                data={currentItems}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <div className="pagination">
                {Array.from({
                    length: Math.ceil(prescricoes.length / itemsPerPage),
                }).map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={
                            currentPage === index + 1
                                ? "active pagination-btn"
                                : "pagination-btn"
                        }
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </TemplatePage>
    );
};

export default Prescricoes;
