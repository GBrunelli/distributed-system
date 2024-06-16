import React from "react";
import TableHeader from "../TableHeader/TableHeader";
import TableRow from "../TableRow/TableRow";
import TableActions from "../TableActions/TableActions";

const ItemsTable = ({ products }) => {
    return (
        <div className="overflow-x-auto">
            <TableActions />
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <TableHeader />
                <tbody>
                    {products.map((product) => (
                        <TableRow key={product.dropdownId} product={product} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsTable;
