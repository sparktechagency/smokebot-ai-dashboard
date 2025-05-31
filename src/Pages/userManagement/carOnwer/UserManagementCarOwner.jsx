import { useEffect, useState } from 'react'
import { Table, Modal, Button, Tooltip } from 'antd'
import { MdBlock } from 'react-icons/md'
import { CgUnblock } from 'react-icons/cg'
import {
  useChangeStatusStoreMutation,
  useGetAllStoresQuery,
} from '../../../Redux/storeApis'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const UserManagementCarOwner = () => {
  const [userDetails, setSelectedUser] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [actionType, setActionType] = useState('')
  const [owners, setOwners] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const navigate = useNavigate()

  const {
    data: getAllStoreData,
    isLoading,
    isError,
  } = useGetAllStoresQuery({
    searchTerm: searchQuery,
    page,
    limit: 10,
  })

  const [changeStatus, { isLoading: isChangeStatusLoading }] =
    useChangeStatusStoreMutation()

  useEffect(() => {
    if (getAllStoreData) {
      const mappedOwners = getAllStoreData.data.result.map((item) => ({
        ...item,
        key: item._id,
        isBlocked: item?.user?.isBlocked || false,
      }))
      setOwners(mappedOwners)
    }
  }, [getAllStoreData])

  if (isLoading) return <h1>Loading...</h1>
  if (isError) {
    navigate('/user-management/business')
    return
  }

  const handleAction = (record, type) => {
    setSelectedUser(record)
    setActionType(type ? 'unblock' : 'block')
    setIsConfirmModalOpen(true)
  }

  const handleConfirmAction = async () => {
    console.log(userDetails)
    try {
      const res = await changeStatus(userDetails?.user?._id).unwrap()
      if (res.success) {
        toast.success(res.message)

        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner.key === userDetails.key
              ? {
                  ...owner,
                  isBlocked: !owner.isBlocked,
                  user: {
                    ...owner.user,
                    isBlocked: !owner.isBlocked,
                  },
                }
              : owner
          )
        )
        setIsConfirmModalOpen(false)
      } else {
        toast.error('Failed to change status.')
      }
    } catch (error) {
      toast.error('Something went wrong.')
      console.error(error)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      title: <div className="font-bold !font-poppins text-xl">Serial</div>,
      dataIndex: 'id',
      key: 'id',
      render: (_, __, index) => (
        <span className="text-[15px] !font-poppins text-gray-600">
          {index + 1}
        </span>
      ),
    },
    {
      title: <div className="font-bold !font-poppins text-xl">Store Name</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className="flex items-center !font-poppins">
          <span className="text-[15px] text-gray-600">{text}</span>
        </div>
      ),
    },
    {
      title: <div className="font-bold text-xl !font-poppins">Email</div>,
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span className="text-[15px] !font-poppins text-gray-600">{text}</span>
      ),
    },
    // {
    //   title: (
    //     <div className="font-bold !font-poppins text-xl">Subscription</div>
    //   ),
    //   dataIndex: 'subscription',
    //   key: 'subscription',
    //   render: (text) => (
    //     <span className="text-[15px] !font-poppins text-gray-600">{text}</span>
    //   ),
    // },
    {
      title: <div className="font-bold !font-poppins text-xl">Action</div>,
      key: 'action',
      render: (_, record) => (
        <div className="flex space-x-2 !font-poppins items-center">
          <Tooltip title={record?.isBlocked === false ? 'Block' : 'Unblock'}>
            <Button
              type="text"
              icon={
                record.isBlocked ? (
                  <CgUnblock size={23} className="!text-green-500" />
                ) : (
                  <MdBlock size={22} className="!text-red-500" />
                )
              }
              onClick={() => handleAction(record, record.isBlocked)}
              loading={isChangeStatusLoading}
            />
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between flex-wrap">
          <h1 className="text-2xl font-bold mb-6">All Store Information</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="w-[300px] outline-none p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOwners}
          pagination={{
            current: page,
            pageSize: 10,
            total: getAllStoreData?.data?.meta?.total,
            position: ['bottomCenter'],
            onChange: (page) => setPage(page),
          }}
          className="border-gray-200 rounded-lg overflow-hidden"
        />
      </div>

      {/* Confirm Block/Unblock Modal */}
      <Modal
        title={`Confirm ${
          actionType.charAt(0).toUpperCase() + actionType.slice(1)
        }`}
        open={isConfirmModalOpen}
        onOk={handleConfirmAction}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText={actionType === 'block' ? 'Block' : 'Unblock'}
        okButtonProps={{ danger: actionType === 'block' }}
        centered
      >
        <p>
          Are you sure you want to {actionType}{' '}
          <span className="font-bold">{`"${userDetails?.name}"`}</span> store?
        </p>
      </Modal>
    </div>
  )
}

export default UserManagementCarOwner
