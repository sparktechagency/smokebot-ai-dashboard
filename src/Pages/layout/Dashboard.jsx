// import { Outlet } from 'react-router-dom'
// import Sidebar from './Shared/Sidebar'
// // import Navbar from './Shared/Navbar'

// const Dashboard = () => {
//   return (
//     <div className="p-4 box-border rounded-md flex justify-between items-start overflow-hidden h-screen">
//       <div className="  rounded-md overflow-hidden ">
//         <Sidebar />
//       </div>
//       <div className="w-[calc(100vw-288px)] px-3">
//         {/* <Navbar /> */}
//         <div className="h-[94vh] overflow-y-scroll">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

import { Outlet } from 'react-router-dom'
import Sidebar from './Shared/Sidebar'
// import Navbar from './Shared/Navbar'

const Dashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Container */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Optional Navbar */}
        {/* <div className="flex-shrink-0">
          <Navbar />
        </div> */}

        {/* Content Container */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-hidden">
          <div className="h-full overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
