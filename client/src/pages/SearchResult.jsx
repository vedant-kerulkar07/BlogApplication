import BlogCard from '@/components/BlogCard'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchResult = () => {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/search?q=${q}`, {
        method: 'get',
        Credential: 'include'
      })
  return (
    <>
    <div className='flex items-center gap-3 text-xl sm:text-2xl font-bold text-[#4A3728] border-b border-[#EADFD3] pb-3 mb-5'>
    <h4>Search Result For: {q}</h4>
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

export default SearchResult