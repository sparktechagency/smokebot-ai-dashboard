import { useState, useRef } from 'react'
import JoditEditor from 'jodit-react'
import toast from 'react-hot-toast'

const PrivacyPolicy = () => {
  const editor = useRef(null)

  const [customerContent, setCustomerContent] = useState('')

  const handleCustomerClear = () => {
    setCustomerContent('')
  }

  const handleCustomerSave = () => {
    toast.success('Content saved successfully!')
  }

  return (
    <div className="mb-10 bg-gray-200 px-4 h-screen">
      <div className="flex items-center space-x-2 "></div>

      <div className="w-full px-6 py-8 bg-white rounded-lg mt-6">
        <h1 className="text-2xl font-bold mb-5"> Privacy Policy</h1>
        <div className="flex flex-col w-full">
          <JoditEditor
            ref={editor}
            value={customerContent}
            onBlur={setCustomerContent}
            config={{
              buttons:
                'bold,italic,underline,|,ul,ol,|,h1,h2,paragraph,|,align,|,image,link,|,source',
              height: 400,
              placeholder: 'Type here...',
            }}
            className="border rounded-md"
          />

          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleCustomerClear}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              onClick={handleCustomerSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
