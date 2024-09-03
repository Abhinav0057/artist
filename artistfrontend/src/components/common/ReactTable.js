import { useMemo, React } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";

// import Pagination from "react-bootstrap";

const ReactTable = ({ columns, data,handlePageChange,currentPage,totalPages }) => {
  const defaultColumn = useMemo(() => {
   
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageSize: 20 },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div style={{ position: "relative" }}>
        <div style={{  overflow: "auto" }}>
          <div className="d-flex justify-content-left alighn-items-center mb-1">
                </div>
          <div style={{}} className="">
            <table
              {...getTableProps()}
              className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4"
              style={{ overflowX: "auto", height: "100px" }}
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    style={{
                      color: "black",
                      position: "sticky",
                      top: "0",
                      cursor: "pointer",
                      boxShadow:
                        "0px 2px rgba(51, 177, 224, 0.25), 0px 0px rgba(30, 39, 51, 0.05)",
                      backgroundColor: "white",
                      zIndex: "2",
                      padding: "10px 0px",
                    }}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="p-0 m-0 min-w-100px fs-5 fw-bold"
                        style={{
                          color: "black",
                          pointer: "cursor",
                        }}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      className=""
                      style={{
                        color: "black",
                      }}
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            color: "black",
                          }}
                        >
                          {cell.render("Cell")}{" "}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div
          className=" justify-content-center px-2 m-0  "
          style={{ border: "none" }}
        >
        <nav aria-label="Page navigation">
        <ul className="pagination mt-3">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
              aria-label="First"
            >
              <span aria-hidden="true">&laquo;&laquo;</span>
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages)}
              aria-label="Last"
            >
              <span aria-hidden="true">&raquo;&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>    
      </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ReactTable;
