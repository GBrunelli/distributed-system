import React, { useState } from "react";
import { Dropdown, Button, Modal } from "flowbite-react";
import { FaEllipsisV, FaEdit, FaEye, FaTrash } from "react-icons/fa";

const ItemActions = () => {
    const [isEditModalVisible, setEditModalVisible] = useState(false);
    const [isPreviewModalVisible, setPreviewModalVisible] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    return (
        <div>
            <Dropdown
                label={<FaEllipsisV className="w-5 h-5" />}
                className="inline-flex items-center text-sm font-medium  p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                inline
            >
                <Dropdown.Item
                    onClick={() => setEditModalVisible(true)}
                    icon={FaEdit}
                >
                    Edit
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => setPreviewModalVisible(true)}
                    icon={FaEye}
                >
                    Preview
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => setDeleteModalVisible(true)}
                    icon={FaTrash}
                    className="text-red-500 dark:text-red-400"
                >
                    Delete
                </Dropdown.Item>
            </Dropdown>

            {/* Edit Modal */}
            <Modal
                dismissible
                show={isEditModalVisible}
                onClose={() => setEditModalVisible(false)}
            >
                <Modal.Header>Edit Product</Modal.Header>
                <Modal.Body>
                    <p>Modal content for editing a product goes here.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setEditModalVisible(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Preview Modal */}
            <Modal
                dismissible
                show={isPreviewModalVisible}
                onClose={() => setPreviewModalVisible(false)}
            >
                <Modal.Header>Preview Product</Modal.Header>
                <Modal.Body>
                    <p>Modal content for previewing a product goes here.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setPreviewModalVisible(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal
                show={isDeleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
            >
                <Modal.Header>Delete Product</Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this product?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setDeleteModalVisible(false)}>
                        Cancel
                    </Button>
                    <Button color="failure">Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ItemActions;
