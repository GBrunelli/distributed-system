import { Button } from "flowbite-react";
import React from "react";

const TableActions = () => {
    return (
        <div class="w-full max-w-screen-xl px-4 mx-auto lg:px-12">
            <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 md:rounded-lg">
                <div class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                    <Button color="blue">Add</Button>
                    <div
                        class="inline-flex flex-col w-full rounded-md shadow-sm md:w-auto md:flex-row"
                        role="group"
                    >
                        <button
                            type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-t-lg md:rounded-tr-none md:rounded-l-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary-500 dark:focus:text-white"
                        >
                            Positions
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-gray-200 border-x md:border-x-0 md:border-t md:border-b hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary-500 dark:focus:text-white"
                        >
                            Estimated Traffic
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-gray-200 border-x md:border-x-0 md:border-l md:border-b hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary-500 dark:focus:text-white"
                        >
                            Visibility
                        </button>
                        <button
                            type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-b-lg md:rounded-bl-none md:rounded-r-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-2 focus:ring-primary-700 focus:text-primary-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-primary-500 dark:focus:text-white"
                        >
                            All for flowbite.com
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableActions;
