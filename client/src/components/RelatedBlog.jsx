import { getEnv } from '@/helpers/getEnv'
import { RouteBlogDetails } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Link } from 'react-router-dom'

const RelatedBlog = ({ props }) => {
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-related-blog/${props.category}/${props.currentBlog}`, {
        method: 'get',
        credentials: 'include',
    })

    if (loading) return <div className="text-[#8C7B6B] text-sm">Loading....</div>

    return (
        <div>
            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-[#4A3728]'>Related Blog</h2>
            <div>
                {data && data.relatedBlog.length > 0
                    ?
                    data.relatedBlog.map(blog => {
                        return (
                            <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)}>
                                <div className='flex items-center gap-2 sm:gap-3 mb-3 p-2 rounded-lg hover:bg-[#FFF9F2] transition-colors'>
                                    <img
                                        className='w-[80px] h-[56px] sm:w-[100px] sm:h-[70px] object-cover rounded-md shrink-0'
                                        src={blog.featuredImage}
                                        alt={blog.title}
                                    />
                                    <h4 className='line-clamp-2 text-sm sm:text-lg font-semibold text-[#4A3728]'>
                                        {blog.title}
                                    </h4>
                                </div>
                            </Link>
                        )
                    })
                    :
                    <div></div>
                }
            </div>
        </div>
    )
}

export default RelatedBlog