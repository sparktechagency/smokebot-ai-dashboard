import { jwtDecode } from 'jwt-decode'
import { Settings } from 'lucide-react'
import { useGetAllFeaturesQuery } from '../../Redux/featuresApis'

const FeaturesPanel = () => {
  const decodedToken = jwtDecode(localStorage.getItem('token'))
  const { data: getAllFeatures } = useGetAllFeaturesQuery({
    store: decodedToken?.profileId,
    isFeatured: true,
  })
  return (
    <div className="bg-white rounded-xl shadow-lg border h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Settings className="text-green-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">
            Store Features
          </h2>
        </div>
      </div>
      <div
        className="flex-1 p-4 space-y-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
        style={{ maxHeight: 'calc(100vh - 400px)' }}
      >
        {getAllFeatures?.data?.result?.map((feature, index) => (
          <div
            key={feature._id}
            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium text-gray-800">
                {index + 1}. {feature?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default FeaturesPanel
