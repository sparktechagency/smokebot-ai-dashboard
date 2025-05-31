import { Form, Input, Button } from 'antd'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useResetPasswordMutation } from '../../Redux/authApis'
const SetNewPassword = () => {
  const navigate = useNavigate()

  const [postResetPassword, { isLoading }] = useResetPasswordMutation()
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    try {
      const email = localStorage.getItem('email') || ''

      await postResetPassword({
        email: email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
        .unwrap()
        .then((res) => {
          console.log(res)
          toast.success(res?.message)
          form.resetFields()
          localStorage.removeItem('email')
          localStorage.removeItem('token')
          navigate('/login')
        })
    } catch (error) {
      toast.error(error?.data?.message)
    }
  }
  return (
    <div className="h-screen flex responsive-base-width">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <h1 className="text-3xl font-bold  mb-4">Set New Password</h1>

        <Form layout="vertical" onFinish={onFinish} className="w-full max-w-sm">
          <label htmlFor="password" className="text-gray-500 text-[16px] ">
            New Password
          </label>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your new password!' },
              {
                min: 6,
                message: 'Password must be at least 6 characters long!',
              },
            ]}
            className="mt-1"
          >
            <Input.Password
              placeholder="New password"
              className="h-[42px] px-4 border-gray-300 rounded-md"
            />
          </Form.Item>

          <label
            htmlFor="confirmPassword"
            className="text-gray-500 text-[16px] "
          >
            Confirm New Password
          </label>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match!'))
                },
              }),
            ]}
            className="mt-1"
          >
            <Input.Password
              placeholder="confirm password"
              className="h-[42px] px-4 border-gray-300 rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#0095FF] text-white font-bold text-[18px] h-[42px] rounded-md"
            >
              {isLoading ? 'Loading...' : 'Save Password'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-white">
        <div className="mt-5 w-[360px] text-gray-500 text-[18px] text-center leading-8">
          Create a new password.
        </div>
      </div>
    </div>
  )
}

export default SetNewPassword
