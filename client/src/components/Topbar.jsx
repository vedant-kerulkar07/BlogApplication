import React, { use, useState } from 'react'
import logo from "@/assets/images/logo-white.png"
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { IoLogIn } from "react-icons/io5";
import SearchBox from './SearchBox';
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png';
import { FaUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { removeUser } from '@/redux/user/user.slice';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
import { FaSearch } from "react-icons/fa";
import { TbMenu4 } from "react-icons/tb";
import { useSidebar } from './ui/sidebar';

const Topbar = () => {
  const { toggleSidebar } = useSidebar()
  const [searchVisible, setSearchVisible] = useState(false)
  const dispath = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  const handleLogout = async () => {
    try {
      const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`, {
        method: 'get',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return showToast('error', data.message)
      }
      dispath(removeUser())
      navigate(RouteIndex)
      showToast('success', data.message)

    } catch (error) {
      showToast('error', error.message)
    }
  }

  const toggleSearch = () => {
    setSearchVisible(!searchVisible)
  }

  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-[#FFF9F2] px-3 sm:px-5 border-b border-[#EADFD3]'>
      <div className='flex justify-center items-center gap-2 shrink-0'>
        <button onClick={toggleSidebar} type='button' className='md:hidden text-[#4A3728]'>
          <TbMenu4 size={22} />
        </button>
        <Link to={RouteIndex}>
          <img src={logo} className='md:w-auto w-36 sm:w-48' />
        </Link>
      </div>

      <div className='flex-1 max-w-[500px] mx-2 sm:mx-4'>
        <div className={`md:relative md:block absolute bg-[#FFF9F2] left-0 w-full md:top-0 top-16 md:p-0 p-2 border-b md:border-b-0 border-[#EADFD3]
          ${searchVisible ? 'block' : 'hidden'}`}>
          <SearchBox />
        </div>
      </div>

      <div className='flex items-center gap-3 sm:gap-5 shrink-0'>

        <button onClick={toggleSearch} type='button' className='md:hidden block text-[#4A3728]'>
          <FaSearch size={20} />
        </button>

        {!user.isLoggedIN ?
          <Button asChild className='rounded-full bg-[#D97748] hover:bg-[#c2663d] text-white text-sm sm:text-base px-3 sm:px-4'>
            <Link to={RouteSignIn} className="flex items-center gap-1.5">
              <IoLogIn />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          </Button>
          :
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-transparent hover:ring-[#D97748]/30 transition-all">
                <AvatarImage src={user.user?.avatar || usericon} />
                <AvatarFallback className="bg-[#E8A33D]/20 text-[#4A3728]">CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-[#EADFD3]">
              <DropdownMenuLabel>
                <p className="text-[#4A3728]">{user.user?.name}</p>
                <p className='text-sm text-[#8C7B6B]'>{user.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#EADFD3]" />
              <DropdownMenuItem asChild className="cursor-pointer text-[#4A3728] focus:bg-[#FFF9F2] focus:text-[#D97748]">
                <Link to={RouteProfile}>
                  <FaUser />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer text-[#4A3728] focus:bg-[#FFF9F2] focus:text-[#D97748]">
                <Link to={RouteBlogAdd}>
                  <FaPlus />
                  Create Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#EADFD3]" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-[#4A3728] focus:bg-[#FFF9F2]">
                <IoLogOut color='#D97748' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </div>
  )
}

export default Topbar