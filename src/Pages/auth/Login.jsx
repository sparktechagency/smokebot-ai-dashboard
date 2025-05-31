import { Form, Input, Button } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useLoginMutation } from '../../Redux/authApis'
import logo from '../../../public/111.png'

const Login = () => {
  const navigate = useNavigate()

  const [form] = Form.useForm()

  const [postSignIn, { isLoading }] = useLoginMutation()

  const onFinish = async (values) => {
    try {
      await postSignIn({
        email: values.email,
        password: values.password,
      })
        .unwrap()
        .then((res) => {
          toast.success(res?.message)
          form.resetFields()
          localStorage.setItem('token', res?.data?.accessToken)
          localStorage.setItem('role', res?.data?.role)
          navigate('/')
        })
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message)
    }
  }

  return (
    <div className="h-screen flex responsive-base-width">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <h1 className="text-3xl font-bold mb-2">Please Sign in to Continue</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Please enter your email and password to continue
        </p>

        <Form layout="vertical" onFinish={onFinish} className="w-full max-w-sm">
          <label htmlFor="email" className="text-gray-500 text-[16px] ">
            Email
          </label>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your username or email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
            className="mt-1"
          >
            <Input
              placeholder="Enter  Email"
              className="h-[42px] px-4 border-gray-300 rounded-md"
            />
          </Form.Item>

          <label htmlFor="password" className="text-gray-500 text-[16px] ">
            Password
          </label>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              placeholder="Enter password"
              className="h-[42px] px-4 border-gray-300 rounded-md mt-1"
            />
          </Form.Item>

          <div className="text-center">
            <Link
              to={`/forget-password`}
              className="text-red-500 -mt-5 mb-5 underline underline-offset-2 hover:text-red-400 text-sm flex justify-end "
            >
              Forget Password
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#0095FF] text-white h-[42px] rounded-md"
            >
              {isLoading ? 'Loading...' : 'Log in'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          Don&apos;t have an account?{' '}
          <Link
            to={`/sign-up`}
            className="text-red-500 underline underline-offset-2 hover:text-red-400 text-sm"
          >
            Signup
          </Link>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-white">
        <img src={logo} alt="Login" className=" object-cover mb-10" />
        <div className="text-4xl font-bold">Welcome Back !</div>
        <div className="mt-5 w-[250px] text-gray-500 text-[18px] text-center leading-8">
          Please Sign in into your account with the given details to continue
        </div>
      </div>
    </div>
  )
}

export default Login
