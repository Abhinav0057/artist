import React from "react";

import {
  useGetArtistList,
  useDeleteArtist,
} from "../../services/fetchers/artist/artist";
import ReactTable from "../../components/common/ReactTable";
import { actions } from "react-table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useGetUserProfile } from "../../services/fetchers/auth/auth";
import { Link } from "react-router-dom";

function Artist() {
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useDeleteArtist();

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
    navigate("/artist/register", { state: { artistData: rowData } });
  };
  let dataTableTemp = [];
  const userProfile = useGetUserProfile();
  const [currentPage, setCurrentPage] = React.useState(1);
  // useEffect(() => {
  const artistlist = useGetArtistList(currentPage);
  //  }, [currentPage]);
  if (artistlist?.data?.results?.length > 0) {
    dataTableTemp = artistlist?.data?.results;
  }
  const data = React.useMemo(() => [...dataTableTemp], [artistlist?.data]);
  const columnsTable = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "name", accessor: "name" },
      { Header: "First Release", accessor: "first_release_year" },
      { Header: "Number of Albumbs", accessor: "no_of_albums_released" },
      //   { Header: "Phone", accessor: "phone" },
      { Header: "DoB", accessor: "dob" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) =>
          userProfile?.data?.role_type == "artist_manager" && (
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
      <h3> Artists List</h3>
      <div className="p-2">
        {userProfile?.isSuccess &&
          ["super_admin", "artist_manager"].includes(
            userProfile.data?.role_type
          ) && (
            <div className="d-flex justify-content-end">
              <Link to="/artist/register">
                <button className="btn btn-primary " type="submit">
                  Create new artist
                </button>
              </Link>
            </div>
          )}
      </div>
      {artistlist?.data?.results?.length > 0 && (
        <ReactTable
          data={data}
          columns={columnsTable}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
          totalPages={artistlist?.data?.total_pages}
        ></ReactTable>
      )}
      {artistlist?.data?.results?.length == 0 && (
        <div className="text-center text-danger">No data to preview</div>
      )}
    </div>
  );
}

export default Artist;
