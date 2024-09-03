import React from 'react'

import {useGetUserList} from "../../services/fetchers/users/users"
import ReactTable from "../../components/common/ReactTable"
import { actions } from 'react-table';
function User() {
    
    let dataTableTemp = [];
    const [currentPage, setCurrentPage] = React.useState(1);
    // useEffect(() => {
        const userlist=useGetUserList(currentPage)
            //  }, [currentPage]);
    if(userlist?.data?.results?.length>0){
        dataTableTemp=userlist?.data?.results
    }
    const data = React.useMemo(
        () => [...dataTableTemp],
        [userlist?.data]
      );
      const columnsTable = React.useMemo(
        () => [
          
          { Header: "ID", accessor: "id" },
          { Header: "First Name", accessor: "first_name" },
          { Header: "last Name", accessor: "last_name" },
          { Header: "Phone", accessor: "phone" },
          { Header: "DoB", accessor: "dob" },
           
      
        ],
        [data]
      );
      const handlePageChange = (page) => {
        if (page > 0 ) {
          setCurrentPage(()=>page);
        }
      };
  return (
    <div className='p-2'>
        <h3> Users List</h3>
         {userlist?.data?.results?.length > 0 && (
        <ReactTable data={data} columns={columnsTable} handlePageChange={handlePageChange}currentPage={currentPage}totalPages={userlist?.data?.total_pages}></ReactTable>
      )}
      {userlist?.data?.results?.length == 0 && (
        <div className="text-center text-danger">No data to preview</div>
      )}
    </div>
  )
}

export default User
