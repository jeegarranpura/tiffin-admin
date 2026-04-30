import React, { useState, useEffect } from 'react';
import Button from './Button';



const Table = ({
  headers,
  children,
  footer = true,
  className = '',
  tableData = [],
  loading,
  pagination = true,
  pageSize = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageData, setPageData] = useState([]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  }

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setTotalItems(tableData.length);
      setTotalPages(Math.ceil(tableData.length / pageSize));
      setPageData(tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize));
    } else {
      if (totalItems > 0) {
        setTotalItems(0);
        setTotalPages(1);
        setPageData([]);
      }
    }
  }, [tableData, tableData.length, currentPage, pageSize]);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${header.align === 'right' ? 'text-right' : ''}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-sm text-slate-900">
                  Loading...
                </td>
              </tr>
            ) : pageData.map((row, index) => (
              <tr key={index}>
                {headers.map((header, index) => (
                  <td key={index} className="px-6 py-4 text-sm text-slate-900">
                    {header.render ? header.render(row[header.key], row) : row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableData.length === 0 && !loading && (
        <div className="px-6 py-4 text-sm text-slate-900 text-center">
          No data available
        </div>
      )}
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {(currentPage - 1) * pageSize + 1} to {currentPage * pageSize} of {totalItems} customers</p>
            <div className="flex gap-2">
              <Button disabled={currentPage === 1} variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
              <Button size="sm">{currentPage}</Button>
              <Button disabled={currentPage === totalPages} variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
