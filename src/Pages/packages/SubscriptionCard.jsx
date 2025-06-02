import { MdCheck } from 'react-icons/md'
import { FaCrown } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  usePurchaseSubscriptionMutation,
  useTrialSubscriptionMutation,
} from '../../Redux/stripeApi'

function SubscriptionCard({ subscription, type }) {
  const navigate = useNavigate()
  console.log(type)
  const isPremium = subscription.name.toLowerCase().includes('premium')

  // usePurchaseSubscriptionMutation, useTrialSubscriptionMutation

  const [purchaseSubscription] = usePurchaseSubscriptionMutation()
  const [trialSubscription] = useTrialSubscriptionMutation()

  const handleClickChoose = async (name) => {
    if (name.toLowerCase().includes('free trial')) {
      try {
        const res = await trialSubscription()
        toast.success(res?.error?.data?.message || 'Trial started successfully')
        navigate('/')
      } catch (error) {
        console.log(error?.error?.data?.message)
        toast.error(error?.error?.data?.message)
      }
    } else {
      try {
        const res = await purchaseSubscription()
        const redirectUrl = res?.data?.data?.url
        if (redirectUrl) {
          window.location.href = redirectUrl
        } else {
          toast.error(res?.error?.data?.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error?.error?.data?.message)
      }
    }
  }

  return (
    <div
      className={`relative  group transition-all duration-500 hover:scale-105 ${
        isPremium ? 'transform hover:-translate-y-2' : 'hover:-translate-y-1'
      }`}
    >
      {/* Glow effect for premium */}
      {isPremium && (
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      )}

      <div
        className={`relative rounded-2xl overflow-hidden  transition-all duration-500 ${
          isPremium
            ? 'bg-gradient-to-br from-yellow-50 via-white to-orange-50 border border-yellow-200'
            : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200'
        }`}
      >
        {/* Premium floating badge */}
        {isPremium && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-3 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
            <FaCrown size={16} />
          </div>
        )}

        <div
          className={`relative p-6 ${
            isPremium
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isPremium
                    ? 'bg-white/20 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {isPremium ? 'PREMIUM' : 'FREE'}
              </div>
              {!isPremium && (
                <div>
                  <div className="text-white/80 text-sm font-medium">
                    Validity 5 days
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold  mb-1">{subscription.name} </h2>

            {/* Animated price */}
            <div className="flex items-end">
              <span className="text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                ${subscription.price}
              </span>
              <span className="text-white/70 ml-2 mb-1">
                /{subscription.validity.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Features section with enhanced styling */}
        <div className="p-6">
          <h3
            className={`font-bold text-lg mb-4 ${
              isPremium ? 'text-yellow-700' : 'text-blue-700'
            }`}
          >
            What&apos;s included
          </h3>

          <ul className="space-y-3">
            {subscription.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center group/item hover:transform hover:translate-x-2 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 transition-all duration-300 group-hover/item:scale-110 ${
                    isPremium
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-md'
                  }`}
                >
                  <MdCheck size={14} />
                </div>
                <span className="text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced CTA button */}
        {
          <div className="p-6 pt-0">
            <button
              onClick={() => handleClickChoose(subscription.name)}
              disabled={type == 'Trial' && !isPremium}
              className={`w-full ${
                type == 'Trial' && !isPremium ? 'cursor-not-allowed ' : ''
              }   py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
              }`}
            >
              <span
                className={`
              flex
              items-center
              justify-center
            `}
              >
                Continue with {subscription.name}
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        }

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCard
