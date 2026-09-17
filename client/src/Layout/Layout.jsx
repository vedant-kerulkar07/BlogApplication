import AppSidebar from '@/components/AppSidebar'
import Footer from '@/components/Footer'
import Topbar from '@/components/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <SidebarProvider>
      <Topbar />
      <AppSidebar />
      <main className='w-full bg-[#FFF9F2]'>
        <div className='w-full min-h-[calc(100vh-45px)] pt-20 sm:pt-24 md:pt-28 pb-10 px-4 sm:px-6 md:px-10'>
          <Outlet />
        </div>
        <Footer />
      </main>
    </SidebarProvider>
  )
}

export default Layout