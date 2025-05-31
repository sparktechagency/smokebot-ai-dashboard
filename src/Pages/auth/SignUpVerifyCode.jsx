import { Form, Button } from 'antd'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  useResendOtpForSignUpMutation,
  useVerifyEmailOtpForSignUpMutation,
} from '../../Redux/authApis'

const SignUpVerifyCode = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(6).fill(''))
  const inputRefs = useRef([])
  const [form] = Form.useForm()

  const [postVerifyAccount, { isLoading }] =
    useVerifyEmailOtpForSignUpMutation()
  const [postResendOtp, { isLoading: resendLoading }] =
    useResendOtpForSignUpMutation()

  const updateFormValue = (newOtp) => {
    const otpString = newOtp.join('')
    form.setFieldsValue({ otp: otpString })
    // Clear validation error if OTP is complete
    if (otpString.length === 6) {
      form.validateFields(['otp'])
    }
  }

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/g, '')

    if (!value) {
      // Handle empty input (deletion)
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      updateFormValue(newOtp)
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value[0]
    setOtp(newOtp)
    updateFormValue(newOtp)

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      if (otp[index]) {
        newOtp[index] = ''
        setOtp(newOtp)
        updateFormValue(newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        newOtp[index - 1] = ''
        setOtp(newOtp)
        updateFormValue(newOtp)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!paste) return

    const pasteArray = paste.split('').slice(0, 6)
    const newOtp = Array(6).fill('')

    pasteArray.forEach((char, i) => {
      newOtp[i] = char
    })

    setOtp(newOtp)
    updateFormValue(newOtp)

    const nextIndex = pasteArray.length < 6 ? pasteArray.length : 5
    inputRefs.current[nextIndex]?.focus()
  }

  const onFinishOtp = async () => {
    const email = localStorage.getItem('email') || ''
    if (!email) {
      navigate('/Sign-up')
      return
    }

    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      toast.error('Please enter complete 6-digit OTP')
      return
    }

    try {
      await postVerifyAccount({
        email: email,
        verifyCode: Number(otpCode),
      })
        .unwrap()
        .then((res) => {
          toast.success(res?.message)
          form.resetFields()
          localStorage.setItem('token', res?.data?.accessToken)
          localStorage.removeItem('reset-token')
          localStorage.setItem('reset-token', res?.data?.resetToken)
          navigate('/packages')
        })
    } catch (error) {
      toast.error(error?.data?.message)
    }
  }

  const handleResendOtp = async () => {
    const email = localStorage.getItem('email') || ''

    try {
      await postResendOtp({
        email: email,
      })
        .unwrap()
        .then((res) => {
          toast.success(res?.message)
          // Clear current OTP when resending
          const emptyOtp = Array(6).fill('')
          setOtp(emptyOtp)
          updateFormValue(emptyOtp)
          inputRefs.current[0]?.focus()
        })
    } catch (error) {
      toast.error(error?.data?.message)
    }
  }

  return (
    <div className="h-screen flex responsive-base-width">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
        <h1 className="text-3xl font-bold mb-4">Verification Code</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinishOtp}
          className="w-full max-w-sm"
        >
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter the OTP!' },
              {
                validator: (_, value) => {
                  if (value && value.length === 6) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('Please enter complete 6-digit OTP')
                  )
                },
              },
            ]}
            style={{ textAlign: 'center' }}
          >
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  inputMode="numeric"
                />
              ))}
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#0095FF] text-white font-bold text-[18px] h-[42px] rounded-md"
              disabled={otp.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </Form.Item>
        </Form>

        <div className="flex gap-1">
          <div className="text-gray-500">Send new verification email?</div>
          <div
            className="text-blue-600 hover:text-blue-500 cursor-pointer"
            onClick={handleResendOtp}
          >
            {resendLoading ? 'Resending...' : 'Resend'}
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-white">
        <div className="mt-5 w-[360px] text-gray-500 text-[18px] text-center leading-8">
          Enter 6 digit verification code to continue
        </div>
      </div>
    </div>
  )
}

export default SignUpVerifyCode
