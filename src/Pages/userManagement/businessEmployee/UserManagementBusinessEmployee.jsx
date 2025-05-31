import { useEffect, useState } from 'react'
import { Table, Modal, Button, Tooltip } from 'antd'
import { MdClose } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { useGetAllUsersQuery } from '../../../Redux/normalUserApis'
import { useGetUserChatHistoryQuery } from '../../../Redux/chatApis'

const UserManagementBusinessEmployee = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [owners, setOwners] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [selectedId, setSelectedId] = useState('')

  const {
    data: getAllUsers,
    isLoading,
    isError,
  } = useGetAllUsersQuery({ page, limit: 10 })

  const {
    data: chatHistoryData,
    isFetching: isChatFetching,
    isError: isChatError,
  } = useGetUserChatHistoryQuery({ id: selectedId }, { skip: !selectedId })

  // Set owners when fetched
  useEffect(() => {
    if (getAllUsers?.data?.result) {
      setOwners(getAllUsers.data.result)
    }
  }, [getAllUsers])

  // Set chat history when fetched
  useEffect(() => {
    if (chatHistoryData?.data?.result) {
      setChatHistory(chatHistoryData.data.result)
    }
  }, [chatHistoryData])

  const handleView = (record) => {
    setSelectedId(record._id)
    setUserDetails(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setChatHistory([])
    setUserDetails(null)
    setSelectedId('')
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.contact?.includes(searchQuery) ||
      owner.phone?.includes(searchQuery)
  )

  const columns = [
    {
      title: <div className="font-bold text-xl font-poppins">Serial No.</div>,
      dataIndex: 'id',
      key: 'id',
      render: (_, __, index) => (
        <span className="text-gray-600 font-poppins">
          {(page - 1) * 10 + index + 1}
        </span>
      ),
    },
    {
      title: <div className="font-bold text-xl font-poppins">Name</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="text-gray-600 font-poppins">{text}</span>
      ),
    },
    {
      title: (
        <div className="font-bold text-xl font-poppins">Contact Number</div>
      ),
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <span className="text-gray-600 font-poppins">{text}</span>
      ),
    },
    {
      title: <div className="font-bold text-xl font-poppins">History</div>,
      key: 'action',
      render: (_, record) => (
        <Tooltip title="View Chat History">
          <Button
            type="text"
            icon={<CgProfile size={20} className="!text-blue-600" />}
            onClick={() => handleView(record)}
          />
        </Tooltip>
      ),
    },
  ]

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>You are not authorized</div>

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between flex-wrap">
          <h1 className="text-2xl font-bold mb-6">User Chat History</h1>

          {/* <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="w-64 outline-none p-2 border border-gray-300 rounded-lg"
            />
          </div> */}
        </div>

        <Table
          columns={columns}
          dataSource={filteredOwners}
          rowKey="_id"
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

      {/* User Details Modal with Chat History */}
      <Modal
        title={null}
        open={isModalOpen}
        footer={null}
        onCancel={handleCloseModal}
        width={600}
        className="rounded-lg overflow-hidden"
        closeIcon={<MdClose className="text-white text-lg" />}
        centered
      >
        <div className="bg-blue-600 p-6 -mt-6 -mx-6 mb-6 text-white text-center relative font-poppins">
          <h2 className="text-xl font-bold mt-2">{userDetails?.name}</h2>
          <p className="text-blue-100">{userDetails?.email}</p>
          <p className="text-blue-100">
            {userDetails?.contact || userDetails?.phone}
          </p>
        </div>

        <div className="px-6 font-poppins">
          <h3 className="text-xl font-semibold mb-4">Chat History</h3>
          <div className="max-h-96 overflow-y-auto">
            {isChatFetching ? (
              <div className="text-center text-gray-500 py-6">Loading...</div>
            ) : isChatError ? (
              <div className="text-center text-red-500 py-6">
                Failed to load chat history
              </div>
            ) : chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <div key={chat.id}>
                  <div>
                    <div className=" mb-10 !text-end ">
                      <div className="mb-2 text-blue-500">
                        {userDetails?.name}
                      </div>
                      <span className="font-semibold text-sm   py-3 px-2 rounded-md ">
                        {chat.userMessage}
                      </span>
                    </div>
                    <div className="mb-2 text-red-500">Ai Response</div>
                    <p className="text-sm !bg-yellow-50 mb-5  py-3 px-2 text-justify">
                      {chat.aiReply}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6">
                No chat history available
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagementBusinessEmployee
