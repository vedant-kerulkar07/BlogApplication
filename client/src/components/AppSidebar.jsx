import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import logo from "@/assets/images/logo-white.png"
import { FaHome } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { LiaBlogSolid } from "react-icons/lia";
import { FaComments } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteCommentDetails, RouteIndex, RouteUser } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const user = useSelector(state => state.user)
  const { data: categoryData } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
    method: 'get',
    Credential: 'include'
  })

  return (
    <Sidebar className="bg-[#FFF9F2] border-r border-[#EADFD3]">
      <SidebarHeader className="bg-[#FFF9F2] px-3 py-4">
        <img src={logo} width={110} className="max-w-full h-auto" />
      </SidebarHeader>

      <SidebarContent className="bg-[#FFF9F2]">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarMenuButton className="text-[#4A3728] hover:bg-[#D97748]/10 hover:text-[#D97748] transition-colors rounded-lg gap-2">
                <FaHome className="text-[#D97748] shrink-0" />
                <Link to={RouteIndex} className="truncate">Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user && user.isLoggedIN && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-[#4A3728] hover:bg-[#D97748]/10 hover:text-[#D97748] transition-colors rounded-lg gap-2">
                    <FaComments className="text-[#D97748] shrink-0" />
                    <Link to={RouteCommentDetails} className="truncate">Comments</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton className="text-[#4A3728] hover:bg-[#D97748]/10 hover:text-[#D97748] transition-colors rounded-lg gap-2">
                    <LiaBlogSolid className="text-[#D97748] shrink-0" />
                    <Link to={RouteBlog} className="truncate">Blogs</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}

            {user?.isLoggedIN && user?.user?.role === 'admin' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-[#4A3728] hover:bg-[#D97748]/10 hover:text-[#D97748] transition-colors rounded-lg gap-2">
                    <FaUsers className="text-[#D97748] shrink-0" />
                    <Link to={RouteUser} className="truncate">Users</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-[#4A3728] hover:bg-[#D97748]/10 hover:text-[#D97748] transition-colors rounded-lg gap-2">
                    <BiSolidCategory className="text-[#D97748] shrink-0" />
                    <Link to={RouteCategoryDetails} className="truncate">Categories</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#8C7B6B] uppercase text-xs tracking-wide">
            Categories
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {categoryData && categoryData.category.length > 0 && categoryData.category.map(category =>
              <SidebarMenuItem key={category._id}>
                <SidebarMenuButton className="text-[#4A3728] hover:bg-[#E8A33D]/15 hover:text-[#E8A33D] transition-colors rounded-lg gap-2">
                  <GoDotFill className="text-[#E8A33D] shrink-0 text-xs" />
                  <Link to={RouteBlogByCategory(category.slug)} className="truncate">{category.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar