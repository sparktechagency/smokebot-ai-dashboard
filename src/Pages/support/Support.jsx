import { useState, useEffect } from 'react'
import { Tabs, Input, DatePicker, Button, Modal, Badge, Select } from 'antd'
import { SearchOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons'
import { FiMail, FiSend, FiPhone, FiCalendar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const Support = () => {
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false)
  const [isReadModalOpen, setIsReadModalOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchDate, setSearchDate] = useState(null)
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    message: `Hello,

Thank you for contacting Car Verify support. 

Best regards,
Car Verify Support Team`,
  })
  const [emails, setEmails] = useState([])
  const [filteredEmails, setFilteredEmails] = useState([])
  const [activeTab, setActiveTab] = useState('car-owner')

  useEffect(() => {
    const senderNames = [
      'Ahmed Hassan',
      'Sophia Lee',
      'Michael Johnson',
      'Fatima Al-Sayed',
      'Omar Khan',
      'Sarah Williams',
      'Robert Chen',
      'Aisha Patel',
      'David Rodriguez',
    ]

    const subjects = [
      'Issue with uploading car inspection photos',
      'Payment verification failed',
      'Subscription renewal question',
      'Car details not showing correctly',
      'How to change my profile information?',
      'Problems with mobile app login',
      'Verification process taking too long',
      'Cannot view inspection report',
      'Discount code not working',
    ]

    const contents = [
      "I'm facing an issue with uploading car inspection photos. Every time I try, the images fail to upload.",
      'My payment card was charged but the verification still shows as pending. Can you help?',
      'I need to know when my subscription will expire and how to renew it.',
      "After adding my car, some of the details are incorrect and I can't edit them.",
      "I've been trying to update my profile information but keep getting an error.",
      "The mobile app crashes every time I try to log in. I've tried reinstalling.",
      "I submitted my verification documents over 3 days ago but still haven't heard back.",
      "When I click to view my car's inspection report, nothing happens.",
      'I tried using the discount code CARVERIFY20 but it says invalid.',
    ]

    const generateEmails = Array(12)
      .fill()
      .map((_, index) => {
        const senderName = senderNames[index % senderNames.length]
        const nameInitials = senderName
          .split(' ')
          .map((name) => name[0])
          .join('')
        const domain = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'][
          Math.floor(Math.random() * 4)
        ]
        const senderEmail = `${senderName
          .toLowerCase()
          .replace(' ', '.')}@${domain}`

        const randomDays = Math.floor(Math.random() * 14)
        const date = dayjs().subtract(randomDays, 'day')
        const formattedDate =
          randomDays === 0
            ? 'Today'
            : randomDays === 1
            ? 'Yesterday'
            : `${date.format('MMM D')}`

        return {
          id: index + 1,
          sender: senderName,
          senderEmail: senderEmail,
          phone: `+${Math.floor(Math.random() * 1000000000000)}`,
          recipient: 'support@carverify.com',
          subject: subjects[index % subjects.length],
          content: contents[index % contents.length],
          time: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(
            Math.random() * 60
          )
            .toString()
            .padStart(2, '0')}${
            Math.random() > 0.5 ? 'am' : 'pm'
          }, ${formattedDate}`,
          date: date,
          isPremium: Math.random() > 0.5,
          businessType: Math.random() > 0.7 ? 'Business' : 'Personal',
          avatar: null,
          nameInitials: nameInitials,
          isRead: Math.random() > 0.4,
        }
      })

    setEmails(generateEmails)
    setFilteredEmails(generateEmails)
  }, [])

  useEffect(() => {
    let filtered = [...emails]

    if (searchText) {
      filtered = filtered.filter(
        (email) =>
          email.sender.toLowerCase().includes(searchText.toLowerCase()) ||
          email.senderEmail.toLowerCase().includes(searchText.toLowerCase()) ||
          email.subject.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (searchDate) {
      filtered = filtered.filter(
        (email) =>
          dayjs(email.date).format('YYYY-MM-DD') ===
          searchDate.format('YYYY-MM-DD')
      )
    }

    filtered = filtered.filter((email) =>
      activeTab === 'car-owner'
        ? email.businessType === 'Personal'
        : email.businessType === 'Business'
    )

    setFilteredEmails(filtered)
  }, [searchText, searchDate, emails, activeTab])

  const handleEmailClick = (email) => {
    if (!email.isRead) {
      const updatedEmails = emails.map((e) =>
        e.id === email.id ? { ...e, isRead: true } : e
      )
      setEmails(updatedEmails)
    }

    setSelectedEmail(email)
    setIsReadModalOpen(true)
  }

  const handleReadModalClose = () => {
    setIsReadModalOpen(false)
    setSelectedEmail(null)
  }

  const handleComposeInputChange = (field, value) => {
    setComposeForm({
      ...composeForm,
      [field]: value,
    })
  }

  const handleSendMessage = () => {
    if (!composeForm.to) {
      toast.error('Please specify a recipient email address')
      return
    }

    if (!composeForm.subject) {
      toast.error('Please add a subject for your email')
      return
    }

    toast.success('Message sent successfully!')
    setIsComposeModalOpen(false)

    setComposeForm({
      to: '',
      subject: '',
      message: `Hello,

Thank you for contacting Car Verify support. 

Best regards,
Car Verify Support Team`,
    })
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  return (
    <div className="bg-gray-200 min-h-screen p-4 !font-poppins">
      <div className=" mx-auto bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <Tabs
            defaultActiveKey="car-owner"
            className="mb-0 !font-poppins"
            onChange={handleTabChange}
          >
            <Tabs.TabPane tab="Car owner" key="car-owner" />
            <Tabs.TabPane tab="Business" key="business" />
          </Tabs>

          <div className="flex items-center space-x-2">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Search by name or email"
              className="w-60 h-[42px]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <DatePicker
              className="w-32 h-[42px] !mr-5"
              placeholder="Filter date"
              onChange={(date) => setSearchDate(date)}
              value={searchDate}
            />
            <Button
              type="primary"
              className="bg-blue-600 h-[42px] w-[120px] font-bold mb-0.5"
              onClick={() => setIsComposeModalOpen(true)}
            >
              Compose
            </Button>
          </div>
        </div>

        <div className="p-2 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center  space-x-4">
            <span className="font-medium px-2">Filter by:</span>
            <Select
              defaultValue="all"
              className="!font-poppins h-[42px]"
              style={{ width: 120 }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'read', label: 'Read' },
                { value: 'unread', label: 'Unread' },
                { value: 'premium', label: 'Premium' },
              ]}
              onChange={(value) => {
                let filtered = [...emails]

                if (value === 'read') {
                  filtered = filtered.filter((email) => email.isRead)
                } else if (value === 'unread') {
                  filtered = filtered.filter((email) => !email.isRead)
                } else if (value === 'premium') {
                  filtered = filtered.filter((email) => email.isPremium)
                }

                setFilteredEmails(filtered)
              }}
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredEmails.length} of {emails.length} messages
          </div>
        </div>

        <div className="divide-y !font-poppins px-2 mb-10">
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                  !email.isRead ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="w-1/6 !font-poppins">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                      {email.nameInitials}
                    </div>
                    <div>
                      <span
                        className={`text-gray-700 !font-poppins ${
                          !email.isRead ? 'font-bold' : ''
                        }`}
                      >
                        {email.sender}
                      </span>
                      {!email.isRead && (
                        <span className="ml-2">
                          <BellOutlined style={{ color: '#1890ff' }} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-4/6">
                  <div
                    className={`font-medium ${
                      !email.isRead ? 'font-bold' : ''
                    }`}
                  >
                    {email.subject}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {email.content.length > 60
                      ? email.content.substring(0, 60) + '...'
                      : email.content}
                  </div>
                </div>
                <div className="w-1/6 text-right">
                  <div className="text-gray-500 text-sm">{email.time}</div>
                  <div className="mt-1">
                    {email.isPremium && (
                      <Badge
                        count="premium"
                        style={{ backgroundColor: '#FFC107', fontSize: '10px' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No messages found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Compose Email Modal for superadmin */}
      <Modal
        title="Compose Email"
        open={isComposeModalOpen}
        onCancel={() => setIsComposeModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsComposeModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="send"
            type="primary"
            className="bg-blue-500"
            icon={<FiSend />}
            onClick={handleSendMessage}
          >
            Send
          </Button>,
        ]}
        className="!font-poppins"
        width={600}
        centered
      >
        <div className="space-y-4 py-2">
          <div className="flex items-center">
            <span className="w-20">To:</span>
            <Input
              placeholder="Recipient email"
              value={composeForm.to}
              onChange={(e) => handleComposeInputChange('to', e.target.value)}
              status={isComposeModalOpen && !composeForm.to ? 'error' : ''}
              className="!font-poppins h-[42px]"
            />
          </div>
          <div className="flex items-center">
            <span className="w-20">Subject:</span>
            <Input
              placeholder="Email subject"
              value={composeForm.subject}
              onChange={(e) =>
                handleComposeInputChange('subject', e.target.value)
              }
              status={isComposeModalOpen && !composeForm.subject ? 'error' : ''}
              className="!font-poppins h-[42px]"
            />
          </div>
          <Input.TextArea
            rows={8}
            value={composeForm.message}
            onChange={(e) =>
              handleComposeInputChange('message', e.target.value)
            }
            placeholder="Compose your email..."
            className="!font-poppins"
          />
        </div>
      </Modal>

      {/* Read Email Modal - shows when clicking on an email */}
      <Modal
        title={
          selectedEmail && (
            <div className="flex items-center !font-poppins">
              <div className="mr-2 !font-poppins w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white overflow-hidden">
                {selectedEmail.avatar ? (
                  <img
                    src={selectedEmail.avatar}
                    alt={selectedEmail.sender}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  selectedEmail.nameInitials
                )}
              </div>
              <div className="!font-poppins">
                <div className="flex items-center !font-poppins">
                  <span className="font-medium ">
                    {selectedEmail?.sender || 'User'}
                  </span>
                  {selectedEmail?.isPremium && (
                    <Badge
                      count="premium"
                      style={{ backgroundColor: '#FFC107', fontSize: '10px' }}
                      className="ml-2"
                    />
                  )}
                </div>
                <div className="text-xs text-gray-500 !font-poppins">
                  {selectedEmail?.businessType}
                </div>
              </div>
            </div>
          )
        }
        open={isReadModalOpen}
        onCancel={handleReadModalClose}
        width={600}
        closeIcon={<CloseOutlined />}
        footer={[
          <Button
            key="reply"
            type="primary"
            className="bg-blue-500"
            onClick={() => {
              setIsReadModalOpen(false)
              setIsComposeModalOpen(true)
              setComposeForm({
                ...composeForm,
                to: selectedEmail?.senderEmail || '',
                subject: `Re: ${selectedEmail?.subject || ''}`,
              })
            }}
          >
            Reply
          </Button>,
        ]}
        centered
      >
        {selectedEmail && (
          <div className="space-y-4 py-2 !font-poppins">
            <div className="flex items-center text-sm">
              <FiMail className="text-gray-500 mr-2" />
              <span>{selectedEmail.senderEmail}</span>
            </div>
            <div className="flex items-center text-sm">
              <FiPhone className="text-gray-500 mr-2" />
              <span>{selectedEmail.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCalendar className="text-gray-500 mr-2" />
              <span>{selectedEmail.time}</span>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Subject: {selectedEmail.subject}</h4>
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-sm whitespace-pre-line">
                  Hello Support Team,
                  <br />
                  <br />
                  {selectedEmail.content}
                  <br />
                  <br />
                  Thank you for your assistance!
                  <br />
                  {selectedEmail.sender}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Support
