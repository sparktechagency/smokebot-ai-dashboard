import { useState } from 'react'
import { Button, Input, Modal, Table } from 'antd'
import {
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import toast from 'react-hot-toast'
import { MdClose } from 'react-icons/md'
import { IoAddCircleOutline } from 'react-icons/io5'

function MakeAdmin() {
  const [users, setUsers] = useState([
    {
      id: '#1',
      name: 'Ahsan Mahfuz',
      email: 'backsiboy@att.com',
      userType: 'Admin',
    },
    {
      id: '#2',
      name: 'Ahsan Mahbub',
      email: 'backsiboy@att.com',
      userType: 'Admin',
    },
  ])

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [passwordVisible, setPasswordVisible] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'Admin',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const showAddModal = () => {
    setIsAddModalOpen(true)
  }

  const handleAddCancel = () => {
    setIsAddModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      userType: 'Admin',
    })
    setPasswordVisible(false)
  }

  const handleAddSubmit = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields')
      return
    }

    const newId = `#${Math.floor(10000 + Math.random() * 90000)}`

    const newUser = {
      id: newId,
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
    }

    setUsers([...users, newUser])
    toast.success('Admin added successfully')
    setIsAddModalOpen(false)
    resetForm()
  }

  const showDeleteModal = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(
        (user) => user.id !== userToDelete.id || user.name !== userToDelete.name
      )
      setUsers(updatedUsers)
      toast.success('User deleted successfully')
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    }
  }

  const columns = [
    {
      title: <div className="font-bold text-xl !text-poppins">Serial No.</div>,
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <span className="text-gray-600 text-[15px] !text-poppins">{text}</span>
      ),
    },
    {
      title: <div className="font-bold text-xl !text-poppins">Name</div>,
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <span className="text-gray-600 text-[15px] !text-poppins">{text}</span>
      ),
    },
    {
      title: <div className="font-bold text-xl !text-poppins">Email</div>,
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span className="text-gray-600 text-[15px] !text-poppins">{text}</span>
      ),
    },
    {
      title: <div className="font-bold text-xl !text-poppins">User Type</div>,
      dataIndex: 'userType',
      key: 'userType',
      render: (text) => (
        <span className="text-blue-600 text-[15px] !text-poppins"> {text}</span>
      ),
    },
    {
      title: <div className="font-bold text-xl !text-poppins">Action</div>,
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined className="!text-[15px]" />}
          onClick={() => showDeleteModal(record)}
          className="text-red-500 hover:text-red-700"
        />
      ),
    },
  ]

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <div className="bg-white rounded-md shadow !p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold ">Make Admin</h1>
          <Button
            type="primary"
            onClick={showAddModal}
            className="!bg-blue-600 hover:!bg-blue-500  text-md py-5 flex items-center justify-center gap-2"
          >
            <IoAddCircleOutline className="text-2xl" />
            Make Admin
          </Button>
        </div>

        {/* Users Table */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={false}
        />
      </div>

      {/* Add Admin Modal */}
      <Modal
        title={
          <div className="text-[28px] text-gray-600 !text-extrabold text-center mb-4 !text-poppins">
            Add Admin Information
          </div>
        }
        open={isAddModalOpen}
        onCancel={handleAddCancel}
        footer={null}
        closeIcon={<MdClose className="text-2xl  !text-red-500" />}
        className="top-8"
        centered
      >
        <div className="py-4">
          <div className="mb-4">
            <label className="block text-[15px]  font-bold !text-poppins mb-2">
              Name
            </label>
            <Input
              name="name"
              placeholder="Type here"
              value={formData.name}
              onChange={handleInputChange}
              className="!text-poppins h-[42px]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[15px]  font-bold !text-poppins mb-2">
              Email
            </label>
            <Input
              name="email"
              placeholder="Type here"
              value={formData.email}
              onChange={handleInputChange}
              className="!text-poppins h-[42px]"
              rules={[
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
              ]}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[15px]  font-bold !text-poppins mb-2">
              Password
            </label>
            <Input.Password
              name="password"
              placeholder="Type here"
              value={formData.password}
              onChange={handleInputChange}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              visibilityToggle={{
                visible: passwordVisible,
                onVisibleChange: setPasswordVisible,
              }}
              className="!text-poppins h-[42px]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[15px]  font-bold !text-poppins mb-2">
              User Type
            </label>
            <Input
              name="userType"
              value={formData.userType}
              disabled
              // className="bg-gray-100"
              className="!text-poppins h-[42px]"
            />
          </div>
          <Button
            type="primary"
            block
            onClick={handleAddSubmit}
            className="bg-blue-500 h-[40px] hover:bg-blue-600 border-none w-full"
          >
            Submit
          </Button>
        </div>
      </Modal>

      <Modal
        title={null}
        open={isDeleteModalOpen}
        onCancel={handleDeleteCancel}
        footer={null}
        closeIcon={<MdClose className="text-xl  !text-red-500" />}
        width={300}
        centered
      >
        <div className="py-4 text-center">
          <p className="text-lg font-medium mb-4">Confirm Deletion?</p>
          {/* <p className="text-gray-500 mb-6">
            Do you want to delete this Admin ?
          </p> */}
          <Button
            type="primary"
            danger
            onClick={handleDeleteConfirm}
            className="bg-blue-500 text-white hover:bg-blue-600 border-none w-full"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default MakeAdmin
