import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

const DashboardHome = () => {
  const Navigate = useNavigate()
  useEffect(() => {
    Navigate('/user-management/car-owner')
  }, [])
  return <div></div>
}

export default DashboardHome
