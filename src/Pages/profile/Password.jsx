import { Form, Input, Button, message } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

const Password = () => {
  const [form] = Form.useForm()

  const handleCancelClick = () => {
    form.resetFields()
  }

  const handleSaveClick = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Password Updated:', values)
        message.success('Password updated successfully!')
      })
      .catch(() => {
        console.error('Validation Failed')
      })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg  w-full ">
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label={
              <div className="text-gray-500 font-bold !font-poppins">
                Current Password
              </div>
            }
            name="currentPassword"
            rules={[
              { required: true, message: 'Please enter your current password' },
            ]}
          >
            <Input.Password
              placeholder="*************"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              className="h-[42px]"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="text-gray-500 font-bold !font-poppins">
                New Password
              </div>
            }
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter your new password' },
            ]}
          >
            <Input.Password
              placeholder="*************"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              className="h-[42px]"
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="text-gray-500 font-bold !font-poppins">
                Confirm New Password
              </div>
            }
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match!'))
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="*************"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              className="h-[42px]"
            />
          </Form.Item>

          <div className="flex items-center justify-center gap-1.5">
            <Button
              type="primary"
              onClick={handleSaveClick}
              className="!px-10 !py-3 !font-poppins"
            >
              Save
            </Button>
            <Button onClick={handleCancelClick} className="!px-10 !py-3 !font-poppins">
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Password
