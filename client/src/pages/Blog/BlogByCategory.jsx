import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useParams } from 'react-router-dom'
import { TbCategoryPlus } from "react-icons/tb";

const BlogByCategory = () => {
    const { category } = useParams()
    const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-blog-by-category/${category}`, {
        method: 'get',
        Credential: 'include'
    }, [category])

    if (loading) return <Loading />

    return (
        <>
            <div className='flex items-center gap-3 text-xl sm:text-2xl font-bold text-[#4A3728] border-b border-[#EADFD3] pb-3 mb-5'>
                <TbCategoryPlus className='text-[#D97748]' />
                <h4>{blogData && blogData.categoryData?.name}</h4>
            </div>
            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 sm:gap-8 md:gap-10'>
                {blogData && blogData.blog.length > 0
                    ?
                    blogData.blog.map(blog => <BlogCard key={blog._id} props={blog} />)
                    :
                    <div className='text-[#8C7B6B]'>Data not Found</div>
                }
            </div>
        </>
    )
}

export default BlogByCategory