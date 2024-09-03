import React from "react";

import {
  useGetUserList,
  useDeleteUser,
} from "../../services/fetchers/users/users";
import ReactTable from "../../components/common/ReactTable";
import { actions } from "react-table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useGetUserProfile } from "../../services/fetchers/auth/auth";
import { Link } from "react-router-dom";

function User() {
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useDeleteUser();

  const handleDelete = async (rowData) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmed) {
      console.log("Record deleted:", rowData);
      try {
        const responseData = await mutateAsync(rowData.id);
        toast.success("Successfully Deleted");
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };
  const handleEdit = (rowData) => {
    navigate("/user/register", { state: { userData: rowData } });
  };
  let dataTableTemp = [];
  const userProfile = useGetUserProfile();
  const [currentPage, setCurrentPage] = React.useState(1);
  // useEffect(() => {
  const userlist = useGetUserList(currentPage);
  //  }, [currentPage]);
  if (userlist?.data?.results?.length > 0) {
    dataTableTemp = userlist?.data?.results;
  }
  const data = React.useMemo(() => [...dataTableTemp], [userlist?.data]);
  const columnsTable = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "last Name", accessor: "last_name" },
      { Header: "Phone", accessor: "phone" },
      { Header: "DoB", accessor: "dob" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <button
              className="btn btn-secondary"
              type="primary"
              onClick={() => handleEdit(row.original)}
              style={{ marginRight: "5px", padding: "2px 5px" }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              type="danger"
              onClick={() => handleDelete(row.original)}
              style={{ padding: "2px 5px" }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [data]
  );
  const handlePageChange = (page) => {
    if (page > 0) {
      setCurrentPage(() => page);
    }
  };
  return (
    <div className="p-2">
      <h3> Users List</h3>
      <div className="p-2">
        {userProfile?.isSuccess &&
          userProfile.data?.role_type === "super_admin" && (
            <div className="d-flex justify-content-end">
              <Link to="/user/register">
                <button className="btn btn-primary " type="submit">
                  Create new user
                </button>
              </Link>
            </div>
          )}
      </div>
      {userlist?.data?.results?.length > 0 && (
        <ReactTable
          data={data}
          columns={columnsTable}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={userlist?.data?.total_pages}
        ></ReactTable>
      )}
      {userlist?.data?.results?.length == 0 && (
        <div className="text-center text-danger">No data to preview</div>
      )}
    </div>
  );
}

export default User;
