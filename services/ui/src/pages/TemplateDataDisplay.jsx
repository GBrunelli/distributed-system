import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "flowbite-react";
import {
    HiPencilAlt,
    HiTrash,
    HiPlus,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";

const TemplateDataDisplay = ({
    fields,
    data,
    onAdd,
    onEdit,
    onDelete,
    getId,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // Novo estado para a pesquisa
    const itemsPerPage = 5;

    const handleAdd = () => {
        setCurrentItem(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setShowModal(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const newItem = fields.reduce((acc, field) => {
            acc[field.id] = event.target[field.id].value;
            return acc;
        }, {});
        if (currentItem) {
            onEdit(getId(currentItem), newItem);
        } else {
            onAdd(newItem);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        onDelete(id);
        if (data.length % itemsPerPage === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const filteredData = data
        .filter((item) => item !== null && item !== undefined) // Filtra os valores null e undefined
        .filter((item) =>
            fields.some(
                (field) =>
                    item[field.id] !== null &&
                    item[field.id] !== undefined && // Verifica se o campo não é null ou undefined
                    item[field.id]
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="w-full px-16 py-8">
            <div className="flex flex-col gap-4 mb-4">
                <div>
                    <Button onClick={handleAdd}>
                        <HiPlus className="mr-2" /> Adicionar
                    </Button>
                </div>
                <hr />
                <div>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    />
                </div>
                <hr />
            </div>

            <div className="flex flex-col gap-8 py-2">
                <Table striped={true}>
                    <Table.Head>
                        {fields.map((field) => (
                            <Table.HeadCell key={field.id}>
                                {field.label}
                            </Table.HeadCell>
                        ))}
                        <Table.HeadCell>Ações</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {paginatedData.map((item) => (
                            <Table.Row key={getId(item)}>
                                {fields.map((field) => (
                                    <Table.Cell key={field.id}>
                                        {item[field.id]}
                                    </Table.Cell>
                                ))}
                                <Table.Cell>
                                    <Button.Group>
                                        <Button
                                            onClick={() => handleEdit(item)}
                                        >
                                            <HiPencilAlt className="mr-2" />{" "}
                                            Editar
                                        </Button>
                                        <Button
                                            color="red"
                                            onClick={() =>
                                                handleDelete(getId(item))
                                            }
                                        >
                                            <HiTrash className="mr-2" /> Deletar
                                        </Button>
                                    </Button.Group>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <hr />

                <div className="flex items-center justify-end py-4">
                    <Button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="mr-2"
                    >
                        <HiChevronLeft className="mr-2" /> Anterior
                    </Button>
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="ml-2"
                    >
                        Próxima <HiChevronRight className="ml-2" />
                    </Button>
                </div>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>
                    {currentItem ? "Editar Item" : "Adicionar novo item"}
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <div key={field.id} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    id={field.id}
                                    defaultValue={
                                        currentItem ? currentItem[field.id] : ""
                                    }
                                    className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    required
                                />
                            </div>
                        ))}
                        <Button type="submit" className="mt-4">
                            {currentItem ? "Salvar mudanças" : "Adicionar"}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TemplateDataDisplay;
