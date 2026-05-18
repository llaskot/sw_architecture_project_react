import React from 'react';

export interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyMessage?: string;
}

function DataTable<T>({
                          data,
                          columns,
                          loading = false,
                          emptyMessage = 'No data available'
                      }: DataTableProps<T>) {
    if (loading) {
        return <div className="data-table-loading">Loading...</div>;
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key} className="data-table__th">
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="data-table__td-empty">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="data-table__tr">
                            {columns.map((column) => (
                                <td key={column.key} className="data-table__td">
                                    {column.render ? column.render(item) : (item as any)[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;