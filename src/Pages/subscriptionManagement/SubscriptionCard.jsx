import { Button, Modal } from 'antd'
import { FiEdit } from 'react-icons/fi'
import { MdDelete, MdCheck } from 'react-icons/md'
import { FaCrown } from 'react-icons/fa'
import { useState } from 'react'

function SubscriptionCard({ subscription, onEdit, onDelete }) {
  // State for delete confirmation modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)

  // Determine card styling based on subscription type
  const isPremium = subscription.name.toLowerCase().includes('premium')

  // Show delete confirmation modal
  const showDeleteConfirmation = () => {
    setIsDeleteModalVisible(true)
  }

  // Handle confirmed deletion
  const handleConfirmDelete = () => {
    onDelete()
    setIsDeleteModalVisible(false)
  }

  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden ${
        isPremium ? 'border-2 border-yellow-400' : 'border border-gray-200'
      }`}
    >
      {/* Premium badge */}
      {isPremium && (
        <div className="bg-yellow-500 text-white py-1 px-3 flex items-center justify-center">
          <FaCrown className="mr-2" />
          <span className="font-bold">PREMIUM</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-xl font-bold ${
              isPremium ? 'text-yellow-600' : 'text-blue-600'
            }`}
          >
            {subscription.name}
          </h2>
          <div className="flex space-x-2">
            <Button
              type="text"
              icon={<FiEdit size={18} />}
              onClick={onEdit}
              className={`${
                isPremium
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-blue-500 hover:text-blue-600'
              }`}
            />
            <Button
              type="text"
              icon={<MdDelete size={18} />}
              onClick={showDeleteConfirmation}
              className="text-red-500 hover:text-red-600"
            />
          </div>
        </div>

        {/* Price section */}
        <div
          className={`mb-4 p-3 rounded-md ${
            isPremium ? 'bg-yellow-50' : 'bg-blue-50'
          }`}
        >
          <div className="flex items-end">
            <span
              className={`text-3xl font-bold ${
                isPremium ? 'text-yellow-600' : 'text-blue-600'
              }`}
            >
              ${subscription.price}
            </span>
            <span className="text-gray-500 ml-1">
              /{subscription.validity.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Features section */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
          <ul className="space-y-2">
            {subscription.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span
                  className={`inline-flex items-center justify-center rounded-full p-1 mr-2 ${
                    isPremium
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <MdCheck size={14} />
                </span>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative elements */}
        {isPremium && (
          <div className="flex justify-end mt-4">
            <FaCrown className="text-yellow-500" size={20} />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>,
        ]}
      >
        <p>
          Are you sure you want to delete the{' '}
          <strong>{subscription.name}</strong> subscription?
        </p>
        <p>This will also remove all associated features.</p>
      </Modal>
    </div>
  )
}

export default SubscriptionCard
