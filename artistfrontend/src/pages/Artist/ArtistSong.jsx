import React from "react";

import {
  useGetArtistSongList,
  useDeleteSong,
} from "../../services/fetchers/artist/artist";
import ReactTable from "../../components/common/ReactTable";
import { actions } from "react-table";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useGetUserProfile } from "../../services/fetchers/auth/auth";
import { Link } from "react-router-dom";

function Artist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutateAsync, isLoading } = useDeleteSong();
  const handleCreateNewArtistHandler = async () => {
    navigate("/artist/songs/create", { state: { userData: {} } });
  };

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
    // console.log({ state: { userData: rowData,isArtist:true } })
    navigate("/artist/songs/create", { state: { userData: rowData } });
  };

  let dataTableTemp = [];
  const userProfile = useGetUserProfile();
  const [currentPage, setCurrentPage] = React.useState(1);
  // useEffect(() => {

  const artistlist = useGetArtistSongList(id);
  console.log(artistlist?.data);
  //  }, [currentPage]);
  if (artistlist?.data?.data?.length > 0) {
    dataTableTemp = artistlist?.data?.data;
  }
  const data = React.useMemo(() => [...dataTableTemp], [artistlist?.data]);
  const columnsTable = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Album Name", accessor: "album_name" },
      { Header: "Genre", accessor: "genre" },
      { Header: "Title", accessor: "title" },

      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) =>
          userProfile?.data?.role_type == "artist" && (
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
      <h3> Song List</h3>
      <div className="p-2">
        {userProfile?.isSuccess &&
          ["artist"].includes(userProfile.data?.role_type) && (
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary "
                type="submit"
                onClick={handleCreateNewArtistHandler}
              >
                Create new song
              </button>
            </div>
          )}
      </div>
      {artistlist?.data?.data?.length > 0 && (
        <ReactTable
          data={data}
          columns={columnsTable}
          handlePageChange={handlePageChange}
          currentPage={1}
          totalPages={1}
        ></ReactTable>
      )}
      {artistlist?.data?.data?.length == 0 && (
        <div className="text-center text-danger">No data to preview</div>
      )}
    </div>
  );
}

export default Artist;
