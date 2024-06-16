import React, { useState } from "react";
import { Table, Button, Modal } from "flowbite-react";
import { HiPencilAlt, HiTrash, HiPlus } from "react-icons/hi";

const TemplateDataDisplay = ({ fields, data, onAdd, onEdit, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

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
            onEdit(currentItem.id, newItem);
        } else {
            onAdd(newItem);
        }
        setShowModal(false);
    };

    return (
        <div className="w-full px-16 py-8 ">
            <div>
                <Button onClick={handleAdd} className="mb-4">
                    <HiPlus className="mr-2" /> Adicionar
                </Button>
            </div>
            <Table striped={true}>
                <Table.Head>
                    {fields.map((field) => (
                        <Table.HeadCell key={field.id}>
                            {field.label}
                        </Table.HeadCell>
                    ))}
                    <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                    {data.map((item) => (
                        <Table.Row key={item.id}>
                            {fields.map((field) => (
                                <Table.Cell key={field.id}>
                                    {item[field.id]}
                                </Table.Cell>
                            ))}
                            <Table.Cell>
                                <Button.Group>
                                    <Button onClick={() => handleEdit(item)}>
                                        <HiPencilAlt className="mr-2" /> Edit
                                    </Button>
                                    <Button
                                        color="red"
                                        onClick={() => onDelete(item.id)}
                                    >
                                        <HiTrash className="mr-2" /> Delete
                                    </Button>
                                </Button.Group>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header>
                    {currentItem ? "Edit Item" : "Add New Item"}
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
                            {currentItem ? "Save Changes" : "Add Item"}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TemplateDataDisplay;
