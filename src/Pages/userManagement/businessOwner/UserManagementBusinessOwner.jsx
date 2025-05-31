import { useEffect, useState } from 'react'
import { Table } from 'antd'
import { useGetAllUsersQuery } from '../../../Redux/normalUserApis'

const UserManagementBusinessOwner = () => {
  const [page, setPage] = useState(1)

  const {
    data: getAllUsers,
    isLoading,
    isError,
  } = useGetAllUsersQuery({
    page,
    limit: 10,
  })

  const [owners, setOwners] = useState([])

  useEffect(() => {
    if (getAllUsers?.data?.result) {
      setOwners(getAllUsers.data.result)
    }
  }, [getAllUsers])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>You are not authorized</div>

  const columns = [
    {
      title: (
        <div className="font-bold text-[18px] !font-poppins">Serial No.</div>
      ),
      key: 'serial',
      render: (_, __, index) => (
        <span className="text-[15px] text-gray-600 !font-poppins">
          {index + 1}
        </span>
      ),
    },
    {
      title: <div className="font-bold text-[18px] !font-poppins">Name</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="text-[15px] text-gray-600 !font-poppins">{text}</span>
      ),
    },
    {
      title: <div className="font-bold text-[18px] !font-poppins">Email</div>,
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span className="text-[15px] text-gray-600 !font-poppins">{text}</span>
      ),
    },
    {
      title: (
        <div className="font-bold text-[18px] !font-poppins">
          Contact Number
        </div>
      ),
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <span className="!font-poppins text-[15px] text-gray-600">{text}</span>
      ),
    },
  ]

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between flex-wrap">
          <h1 className="text-2xl font-bold mb-6">All User Information</h1>
        </div>

        <Table
          rowKey={(record) => record.id || record._id}
          columns={columns}
          dataSource={owners}
          pagination={{
            current: page,
            pageSize: 10,
            total: getAllUsers?.data?.meta?.total,
            position: ['bottomCenter'],
            onChange: (page) => setPage(page),
          }}
          scroll={{ x: 'max-content' }}
          className="border-gray-200 rounded-lg overflow-hidden"
        />
      </div>
    </div>
  )
}

export default UserManagementBusinessOwner
