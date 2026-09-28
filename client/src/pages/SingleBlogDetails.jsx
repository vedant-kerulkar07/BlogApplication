import Comment from '@/components/Comment'
import CommentList from '@/components/CommentList'
import Loading from '@/components/Loading'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { decode } from 'entities'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router-dom'
import { BsCalendar2Date } from "react-icons/bs";
import CommentCount from '@/components/CommentCount'
import LikeCount from '@/components/LikeCount'
import RelatedBlog from '@/components/RelatedBlog'
const SingleBlogDetails = () => {
    const { blog, category } = useParams()
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`, {
        method: 'get',
        Credential: 'include'
    }, [blog, category])

    if (loading) return <Loading />
    return (
        <div className='md:flex-nowrap flex-wrap flex justify-between gap-5 sm:gap-8 md:gap-10'>
            {data && data.blog &&
                <>
                    <div className='border border-[#EADFD3] bg-white rounded md:w-[70%] w-full p-4 sm:p-5'>
                        <h1 className='text-xl sm:text-2xl font-bold mb-5 text-[#4A3728]'>{data.blog.title}</h1>
                        <div className='flex flex-wrap justify-between items-center gap-3'>
                            <div className='flex items-center gap-3 sm:gap-5'>
                                <Avatar className="w-12 h-12 relative group rounded shrink-0">
                                    <AvatarImage src={data.blog.author?.avatar} className='rounded object-cover w-full h-full' />
                                </Avatar>

                                <div className='min-w-0'>
                                    <h2 className='text-lg sm:text-2xl font-bold line-clamp-2 text-[#4A3728]'>{data.blog.author?.name}</h2>
                                    <p className='flex items-center gap-2 mb-2 text-[#8C7B6B] text-sm'>
                                        <BsCalendar2Date />
                                        <span>{moment(data.blog?.createdAt).format('DD-MM-YYYY')}</span>
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3 sm:gap-5 text-[#4A3728]'>
                                <LikeCount props={{ blogid: data.blog?._id }} />
                                <CommentCount props={{ blogid: data.blog?._id }} />
                            </div>
                        </div>
                        <div className='my-5'>
                            <img src={data.blog.featuredImage}
                                className='rounded w-full'
                            />
                        </div>
                        <div className='text-[#4A3728] break-words' dangerouslySetInnerHTML={{ __html: decode(data.blog?.blogContent) || '' }}>
                        </div>
                        <div className='border-t border-[#EADFD3] mt-5 pt-5'>
                            <Comment props={{ blogid: data.blog._id }} />
                        </div>
                    </div>
                </>
            }

            <div className='border border-[#EADFD3] bg-white rounded md:w-[30%] w-full p-4 sm:p-5'>
                <RelatedBlog props={{ category: category, currentBlog: blog }} />
            </div>
        </div>
    )
}

export default SingleBlogDetails