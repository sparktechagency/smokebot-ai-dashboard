import { useState } from 'react'
import { Modal, Button, Form, Input, InputNumber, Select, message } from 'antd'
import { FaPlusCircle } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import toast from 'react-hot-toast'
import SubscriptionCard from './SubscriptionCard'

export default function SimplifiedSubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: 'Free subscription',
      price: 30,
      validity: 'Monthly',
      features: [
        'up to 50+ appointment',
        'unlimited video call',
        'unlimited Audio call',
      ],
    },
    {
      id: 2,
      name: 'Premium subscription',
      price: 99,
      validity: 'Monthly',
      features: [
        'up to 150+ appointment',
        'unlimited video call',
        'unlimited Audio call',
        'priority support',
      ],
    },
  ])

  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [newFeature, setNewFeature] = useState('')
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  const showAddModal = () => {
    if (subscriptions.length >= 2) {
      toast.error('Maximum 2 subscription plans allowed')
      return
    }
    form.resetFields()
    setIsAddModalVisible(true)
  }

  const showEditModal = (subscription) => {
    setCurrentSubscription(subscription)
    editForm.setFieldsValue({
      name: subscription.name,
      price: subscription.price,
      validity: subscription.validity,
      features: subscription.features,
    })
    setIsEditModalVisible(true)
  }

  const handleAddSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const newSubscription = {
          id: Date.now(),
          name: values.name,
          price: values.price,
          validity: values.validity,
          features: values.features || [],
        }

        setSubscriptions([...subscriptions, newSubscription])
        setIsAddModalVisible(false)
        message.success('Subscription added successfully')
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleEditSubmit = () => {
    editForm
      .validateFields()
      .then((values) => {
        const updatedSubscriptions = subscriptions.map((sub) =>
          sub.id === currentSubscription.id ? { ...sub, ...values } : sub
        )

        setSubscriptions(updatedSubscriptions)
        setIsEditModalVisible(false)
        message.success('Subscription updated successfully')
      })
      .catch((info) => {
        console.error('Validate Failed:', info)
      })
  }

  const handleDelete = (id) => {
    const updatedSubscriptions = subscriptions.filter((sub) => sub.id !== id)
    setSubscriptions(updatedSubscriptions)
    toast.success('Subscription deleted successfully')
  }

  const addFeature = (formInstance) => {
    if (!newFeature.trim()) return
    const features = formInstance.getFieldValue('features') || []
    formInstance.setFieldsValue({ features: [...features, newFeature] })
    setNewFeature('')

    if (currentSubscription && formInstance === editForm) {
      const updatedSubscriptions = subscriptions.map((sub) => {
        if (sub.id === currentSubscription.id) {
          return { ...sub, features: [...features, newFeature] }
        }
        return sub
      })
      setSubscriptions(updatedSubscriptions)
    }
  }

  const removeFeature = (formInstance, index) => {
    const features = formInstance.getFieldValue('features') || []
    const newFeatures = features.filter((_, i) => i !== index)

    formInstance.setFieldsValue({
      features: newFeatures,
    })

    if (currentSubscription && formInstance === editForm) {
      const updatedSubscriptions = subscriptions.map((sub) => {
        if (sub.id === currentSubscription.id) {
          return { ...sub, features: newFeatures }
        }
        return sub
      })
      setSubscriptions(updatedSubscriptions)
    }
  }

  return (
    <div className="p-4 h-screen bg-gray-200 mx-auto mb-20 font-poppins">
      <div className="bg-white p-4 h-[calc(100vh-50px)] rounded-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Subscription Plan</h1>
          <Button
            type="primary"
            className="bg-blue-500 flex items-center justify-center p-5 text-[15px]"
            onClick={showAddModal}
            disabled={subscriptions.length >= 2}
          >
            <FaPlusCircle size={20} className="mt-0.5 mr-2" /> Create
            Subscription
          </Button>
        </div>

        <div className="h-[70vh] overflow-auto scroll-smooth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onEdit={() => showEditModal(subscription)}
                onDelete={() => handleDelete(subscription.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Subscription Modal */}
      <Modal
        title={
          <div className="text-[28px] text-gray-600 font-extrabold text-center mb-4">
            Add New Subscription
          </div>
        }
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsAddModalVisible(false)}
            className="px-10 py-4"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddSubmit}
            className="px-10 py-4"
          >
            Add
          </Button>,
        ]}
        closeIcon={<MdClose className="text-2xl text-red-500" />}
        centered
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="name"
            label={
              <div className="text-[15px] font-bold">Subscription name</div>
            }
            rules={[
              { required: true, message: 'Please input subscription name!' },
            ]}
          >
            <Input placeholder="Type here..." className="h-[42px]" />
          </Form.Item>

          <div className="flex space-x-4">
            <Form.Item
              name="price"
              label={<div className="text-[15px] font-bold">Price</div>}
              className="w-1/2"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <InputNumber
                className="w-full h-[42px] pt-1"
                formatter={(value) => `$ ${value}`}
                parser={(value) => value.replace(/\$\s?/g, '')}
                placeholder="0"
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="validity"
              label={<div className="text-[15px] font-bold">Validity</div>}
              className="w-1/2"
              rules={[{ required: true, message: 'Please select validity!' }]}
            >
              <Select placeholder="Select period" className="h-[42px]">
                <Select.Option value="Daily">Daily</Select.Option>
                <Select.Option value="Weekly">Weekly</Select.Option>
                <Select.Option value="Monthly">Monthly</Select.Option>
                <Select.Option value="Yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1 text-[15px]">
              Add Feature
            </label>
            <div className="flex">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Type here"
                onPressEnter={() => addFeature(form)}
                className="h-[42px]"
              />
              <Button
                className="ml-2 py-5"
                icon={<FaPlusCircle size={16} className="mt-1 text-blue-600" />}
                onClick={() => addFeature(form)}
              />
            </div>
          </div>

          <Form.Item name="features">
            <div className="space-y-2">
              {(form.getFieldValue('features') || []).map((feature, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-blue-50 rounded"
                >
                  <span>{feature}</span>
                  <Button
                    type="text"
                    danger
                    icon={<MdClose size={14} />}
                    onClick={() => removeFeature(form, index)}
                  />
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal
        title={
          <div className="text-[28px] text-gray-600 font-extrabold text-center mb-4">
            Edit Subscription
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button
            key="back"
            onClick={() => setIsEditModalVisible(false)}
            className="px-10 py-4"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="px-10 py-4"
            onClick={handleEditSubmit}
          >
            Update
          </Button>,
        ]}
        closeIcon={<MdClose className="text-2xl text-red-500" />}
        centered
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item
            name="name"
            label={
              <div className="text-[15px] font-bold">Subscription name</div>
            }
            rules={[
              { required: true, message: 'Please input subscription name!' },
            ]}
          >
            <Input placeholder="Type here..." className="h-[42px]" />
          </Form.Item>
          <div className="flex space-x-4">
            <Form.Item
              name="price"
              label={<div className="text-[15px] font-bold">Price</div>}
              className="w-1/2"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <InputNumber
                className="w-full h-[42px] pt-1"
                formatter={(value) => `$ ${value}`}
                parser={(value) => value.replace(/\$\s?/g, '')}
                placeholder="0"
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="validity"
              label={<div className="text-[15px] font-bold">Validity</div>}
              className="w-1/2"
              rules={[{ required: true, message: 'Please select validity!' }]}
            >
              <Select placeholder="Select period" className="h-[42px]">
                <Select.Option value="Daily">Daily</Select.Option>
                <Select.Option value="Weekly">Weekly</Select.Option>
                <Select.Option value="Monthly">Monthly</Select.Option>
                <Select.Option value="Yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1 text-[15px]">
              Add Feature
            </label>
            <div className="flex">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Type here"
                onPressEnter={() => addFeature(editForm)}
                className="h-[42px]"
              />
              <Button
                className="ml-2 py-5"
                icon={<FaPlusCircle size={16} className="mt-1 text-blue-600" />}
                onClick={() => addFeature(editForm)}
              />
            </div>
          </div>
          <Form.Item name="features">
            <div className="space-y-2">
              {(editForm.getFieldValue('features') || []).map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-blue-50 rounded"
                  >
                    <span>{feature}</span>
                    <Button
                      type="text"
                      danger
                      icon={<MdClose size={14} />}
                      onClick={() => removeFeature(editForm, index)}
                    />
                  </div>
                )
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
