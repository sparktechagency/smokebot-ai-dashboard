// import { FaUsers } from 'react-icons/fa'
// import { NavLink, useLocation } from 'react-router-dom'

// import { GrPlan } from 'react-icons/gr'
// import { useState } from 'react'
// import {
//   RiArrowDownSLine,
//   RiArrowUpSLine,
//   RiLogoutBoxLine,
// } from 'react-icons/ri'
// import { MdOutlineLaunch, MdOutlineLocalGroceryStore } from 'react-icons/md'
// import { useEffect } from 'react'
// import { jwtDecode } from 'jwt-decode'

// import logo from '../../../../public/111.png'

// const Sidebar = () => {
//   const location = useLocation()
//   const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)

//   const [userType, setUserType] = useState('storeOwner')

//   useEffect(() => {
//     const decoded = jwtDecode(localStorage.getItem('token'))
//     console.log(decoded?.role)
//     setUserType(decoded?.role)
//   }, [])

//   const userManagementSubItems = [
//     {
//       name: 'Store Management',
//       link: '/user-management/car-owner',
//     },

//     {
//       name: 'User Management',
//       link: '/user-management/business',
//     },
//     {
//       name: 'User Chat History',
//       link: '/user-management/business-employee',
//     },
//   ]

//   const menuItems = []

//   const menuItemsForStore = [
//     {
//       name: 'Subscriptions Plan',
//       link: '/packages',
//       icon: <GrPlan />,
//     },
//     {
//       name: 'Inventory Management',
//       link: '/inventory-management',
//       icon: <MdOutlineLocalGroceryStore />,
//     },
//     {
//       name: 'Launch SmokeBot',
//       link: '/user-signup',
//       icon: <MdOutlineLaunch />,
//     },
//   ]

//   const logoutMenus = [
//     {
//       name: 'Logout',
//       link: '/login',
//       icon: <RiLogoutBoxLine />,
//     },
//   ]

//   const handleLogout = () => {
//     localStorage.clear()
//   }

//   const isUserManagementActive = location.pathname.includes('/user-management')

//   return (
//     <div className=" w-[300px] h-[96vh] overflow-y-scroll px-3">
//       <div>
//         <div className="text-3xl font-bold text-center from-neutral-500">
//           <img src={logo} alt="logo" />
//         </div>
//       </div>

//       <ul className="mt-10">
//         {/* User Management */}
//         <li className="my-1">
//           <div
//             className={`flex items-center justify-between py-3 rounded-3xl pl-6 cursor-pointer ${
//               isUserManagementActive
//                 ? '!bg-gray-600 !text-white'
//                 : 'hover:bg-gray-400 hover:text-white'
//             }`}
//             onClick={() => setIsUserManagementOpen(!isUserManagementOpen)}
//           >
//             <div className="flex items-center">
//               <span className="mr-4 text-xl">
//                 <FaUsers />
//               </span>
//               <span>Management</span>
//             </div>
//             <span className="mr-4">
//               {isUserManagementOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
//             </span>
//           </div>

//           {/* Submenu items */}
//           {isUserManagementOpen && (
//             <div className="ml-4">
//               {userManagementSubItems.map((subItem, idx) =>
//                 subItem.name === 'Store Management' &&
//                 userType === 'storeOwner' ? null : (
//                   <NavLink
//                     key={idx}
//                     to={subItem.link}
//                     className={({ isActive }) =>
//                       `flex items-center py-2 px-6 my-1 rounded-xl hover:bg-gray-400 hover:text-white
//             ${isActive ? 'bg-gray-600 text-white' : 'bg-gray-100'}`
//                     }
//                   >
//                     <span className="ml-6">{subItem.name}</span>
//                   </NavLink>
//                 )
//               )}
//             </div>
//           )}
//         </li>

//         {/* Remaining menu items */}
//         {userType === 'superAdmin' &&
//           menuItems.map((item, index) => (
//             <NavLink
//               to={item?.link}
//               key={`remaining-${index}`}
//               className={({ isActive }) =>
//                 `flex items-center py-3 rounded-3xl my-1 pl-6 hover:bg-gray-400 cursor-pointer hover:text-white ${
//                   isActive ? 'bg-gray-600 text-white' : ''
//                 }`
//               }
//             >
//               <span className="mr-4 text-xl">{item.icon}</span>
//               <span>{item.name}</span>
//             </NavLink>
//           ))}
//         {userType === 'storeOwner' &&
//           menuItemsForStore.map((item, index) => (
//             <NavLink
//               to={item?.link}
//               key={`remaining-${index}`}
//               className={({ isActive }) =>
//                 `flex items-center py-3 rounded-3xl my-1 pl-6 hover:bg-gray-400 cursor-pointer hover:text-white ${
//                   isActive ? 'bg-gray-600 text-white' : ''
//                 }`
//               }
//             >
//               <span className="mr-4 text-xl">{item.icon}</span>
//               <span>{item.name}</span>
//             </NavLink>
//           ))}

//         {/* Logout */}
//         <li className="my-1">
//           <NavLink
//             to={logoutMenus[0]?.link}
//             className={({ isActive }) =>
//               `flex items-center py-3 rounded-3xl my-1 pl-6 hover:bg-gray-400 cursor-pointer hover:text-white ${
//                 isActive ? 'bg-gray-600 text-white' : ''
//               }`
//             }
//             onClick={handleLogout}
//           >
//             <span className="mr-4 text-xl">{logoutMenus[0]?.icon}</span>
//             <span>{logoutMenus[0]?.name}</span>
//           </NavLink>
//         </li>
//       </ul>
//     </div>
//   )
// }

// export default Sidebar

import { FaUsers } from 'react-icons/fa'
import { NavLink, useLocation } from 'react-router-dom'
import { GrPlan } from 'react-icons/gr'
import { useState } from 'react'
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiLogoutBoxLine,
  RiMenuLine,
  RiCloseLine,
} from 'react-icons/ri'
import { MdOutlineLaunch, MdOutlineLocalGroceryStore } from 'react-icons/md'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

import logo from '../../../../public/111.png'

const Sidebar = () => {
  const location = useLocation()
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userType, setUserType] = useState('storeOwner')

  useEffect(() => {
    const decoded = jwtDecode(localStorage.getItem('token'))
    console.log(decoded?.role)
    setUserType(decoded?.role)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.sidebar-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isMobileMenuOpen])

  const userManagementSubItems = [
    {
      name: 'Store Management',
      link: '/user-management/car-owner',
    },
    {
      name: 'User Management',
      link: '/user-management/business',
    },
    {
      name: 'User Chat History',
      link: '/user-management/business-employee',
    },
  ]

  const menuItems = []

  const menuItemsForStore = [
    {
      name: 'Subscriptions Plan',
      link: '/packages',
      icon: <GrPlan />,
    },
    {
      name: 'Inventory Management',
      link: '/inventory-management',
      icon: <MdOutlineLocalGroceryStore />,
    },
    {
      name: 'Launch SmokeBot',
      link: '/user-signup-have-account',
      icon: <MdOutlineLaunch />,
    },
  ]

  const logoutMenus = [
    {
      name: 'Logout',
      link: '/login',
      icon: <RiLogoutBoxLine />,
    },
  ]

  const handleLogout = () => {
    localStorage.clear()
  }

  const isUserManagementActive = location.pathname.includes('/user-management')

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-6 lg:justify-center">
        <div className="text-3xl font-bold text-center">
          <img
            src={logo}
            alt="logo"
            className="max-w-[120px] sm:max-w-[150px]"
          />
        </div>
        {/* Close button for mobile */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-200"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <RiCloseLine className="text-2xl" />
        </button>
      </div>

      <ul className="space-y-2 flex-1 overflow-y-auto">
        {/* User Management */}
        <li>
          <div
            className={`flex items-center justify-between py-3 rounded-3xl px-4 lg:px-6 cursor-pointer transition-all duration-200 ${
              isUserManagementActive
                ? '!bg-gray-600 !text-white'
                : 'hover:bg-gray-400 hover:text-white'
            }`}
            onClick={() => setIsUserManagementOpen(!isUserManagementOpen)}
          >
            <div className="flex items-center">
              <span className="mr-3 lg:mr-4 text-lg lg:text-xl">
                <FaUsers />
              </span>
              <span className="text-sm lg:text-base">Management</span>
            </div>
            <span className="mr-2 lg:mr-4">
              {isUserManagementOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
            </span>
          </div>

          {/* Submenu items */}
          {isUserManagementOpen && (
            <div className="ml-2 lg:ml-4 mt-2 space-y-1">
              {userManagementSubItems.map((subItem, idx) =>
                subItem.name === 'Store Management' &&
                userType === 'storeOwner' ? null : (
                  <NavLink
                    key={idx}
                    to={subItem.link}
                    className={({ isActive }) =>
                      `flex items-center py-2 px-4 lg:px-6 rounded-xl hover:bg-gray-400 hover:text-white transition-all duration-200
                      ${isActive ? 'bg-gray-600 text-white' : 'bg-gray-100'}`
                    }
                  >
                    <span className="ml-4 lg:ml-6 text-sm lg:text-base">
                      {subItem.name}
                    </span>
                  </NavLink>
                )
              )}
            </div>
          )}
        </li>

        {/* Remaining menu items */}
        {userType === 'superAdmin' &&
          menuItems.map((item, index) => (
            <li key={`remaining-${index}`}>
              <NavLink
                to={item?.link}
                className={({ isActive }) =>
                  `flex items-center py-3 rounded-3xl px-4 lg:px-6 hover:bg-gray-400 cursor-pointer hover:text-white transition-all duration-200 ${
                    isActive ? 'bg-gray-600 text-white' : ''
                  }`
                }
              >
                <span className="mr-3 lg:mr-4 text-lg lg:text-xl">
                  {item.icon}
                </span>
                <span className="text-sm lg:text-base">{item.name}</span>
              </NavLink>
            </li>
          ))}

        {userType === 'storeOwner' &&
          menuItemsForStore.map((item, index) => (
            <li key={`store-${index}`}>
              <NavLink
                to={item?.link}
                className={({ isActive }) =>
                  `flex items-center py-3 rounded-3xl px-4 lg:px-6 hover:bg-gray-400 cursor-pointer hover:text-white transition-all duration-200 ${
                    isActive ? 'bg-gray-600 text-white' : ''
                  }`
                }
              >
                <span className="mr-3 lg:mr-4 text-lg lg:text-xl">
                  {item.icon}
                </span>
                <span className="text-sm lg:text-base">{item.name}</span>
              </NavLink>
            </li>
          ))}

        {/* Logout */}
        <li>
          <NavLink
            to={logoutMenus[0]?.link}
            className={({ isActive }) =>
              `flex items-center py-3 rounded-3xl px-4 lg:px-6 hover:bg-gray-400 cursor-pointer hover:text-white transition-all duration-200 ${
                isActive ? 'bg-gray-600 text-white' : ''
              }`
            }
            onClick={handleLogout}
          >
            <span className="mr-3 lg:mr-4 text-lg lg:text-xl">
              {logoutMenus[0]?.icon}
            </span>
            <span className="text-sm lg:text-base">{logoutMenus[0]?.name}</span>
          </NavLink>
        </li>
      </ul>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 !bg-gray-200  h-[97vh] flex items-start rounded-lg shadow-lg border hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <RiMenuLine className="text-2xl text-blue-700 " />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}

      {/* Sidebar Container */}
      <div
        className={`sidebar-container fixed lg:relative bg-white border-r border-gray-200 h-full z-50 transition-all duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
          w-[280px] sm:w-[300px] lg:w-[280px] xl:w-[300px] 2xl:w-[320px] !min-w-64`}
      >
        <div className="flex flex-col h-full p-3 lg:p-4">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}

export default Sidebar
