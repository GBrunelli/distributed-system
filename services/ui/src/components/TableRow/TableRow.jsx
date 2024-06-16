import React from "react";
import ItemsTable from "../ItemsTable/ItemsTable";
import ItemActions from "../ItemActions/ItemActions";

const TableRow = ({ product }) => {
    const { name, category, brand, description, price, dropdownId } = product;
    return (
        <tr className="border-b dark:border-gray-700">
            <th
                scope="row"
                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                {name}
            </th>
            <td className="px-4 py-3">{category}</td>
            <td className="px-4 py-3">{brand}</td>
            <td className="px-4 py-3 max-w-[12rem] truncate">{description}</td>
            <td className="px-4 py-3">{price}</td>
            <td className="flex items-center justify-end px-4 py-3">
                <ItemActions dropdownId={dropdownId} />
            </td>
        </tr>
    );
};

export default TableRow;
