import React from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from "@/components/ui/badge"
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import { BsFillCalendar2DateFill } from "react-icons/bs";
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { RouteBlogDetails } from '@/helpers/RouteName'

const BlogCard = ({ props }) => {

  return (
    <div>
      <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
        <Card className="pt-4 sm:pt-5 bg-white border border-[#EADFD3] hover:shadow-md hover:border-[#D97748]/40 transition-all duration-200">
          <CardContent className="px-3 sm:px-4">
            <div className='flex items-center justify-between gap-2'>
              <div className='flex justify-between items-center gap-2 min-w-0'>
                <Avatar className="shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage src={props?.author?.avatar || usericon} />
                </Avatar>
                <span className="text-sm sm:text-base text-[#4A3728] truncate">
                  {props?.author?.name}
                </span>
              </div>

              {props?.author?.role === 'admin' &&
                <Badge variant="outline" className="bg-[#D97748] text-white border-none shrink-0 text-xs">
                  Admin
                </Badge>
              }
            </div>

            <div className='my-2 sm:my-3'>
              <div className="w-full aspect-[16/9] overflow-hidden rounded-lg bg-[#FFF9F2]">
                <img
                  src={props.featuredImage}
                  alt={props.title}
                  className='w-full h-full object-cover rounded-lg'
                />
              </div>
            </div>

            <div>
              <p className='flex items-center gap-2 mb-1.5 sm:mb-2 text-xs sm:text-sm text-[#8C7B6B]'>
                <BsFillCalendar2DateFill className="text-[#D97748] shrink-0" />
                <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
              </p>
              <h2 className='text-lg sm:text-xl md:text-2xl font-bold line-clamp-2 text-[#4A3728]'>
                {props.title}
              </h2>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}

export default BlogCard