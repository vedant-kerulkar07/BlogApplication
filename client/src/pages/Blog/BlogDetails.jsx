import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import { deleteData } from '@/helpers/handleDelete'
import { showToast } from '@/helpers/showToast'
import Loading from '@/components/Loading'
import { MdEdit } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import moment from 'moment'

const BlogDetails = () => {

  const [refreshData, setRefreshData] = useState(false)

  const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-all`, {
    method: 'get',
    credentials: 'include'
  }, [refreshData])

  const handleDelete = (id) => {
    const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
    if (response) {
      setRefreshData(!refreshData)
      showToast('success', 'Data deleted')
    } else {
      showToast('error', 'Data not deleted')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <Card className="bg-white border-[#EADFD3] shadow-sm">
        <CardHeader>
          <div>
            <Button asChild className="bg-[#D97748] hover:bg-[#c2663d] text-white">
              <Link to={RouteBlogAdd}>
                Add Blog
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption className="text-[#8C7B6B]">A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow className="border-[#EADFD3] hover:bg-[#FFF9F2]">
                  <TableHead className="text-[#4A3728]">Author</TableHead>
                  <TableHead className="text-[#4A3728]">Category</TableHead>
                  <TableHead className="text-[#4A3728]">Title</TableHead>
                  <TableHead className="text-[#4A3728]">Slug</TableHead>
                  <TableHead className="text-[#4A3728]">Dated</TableHead>
                  <TableHead className="text-[#4A3728]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogData && blogData.blog.length > 0 ?

                  blogData.blog.map(blog =>
                    <TableRow key={blog._id} className="border-[#EADFD3] hover:bg-[#FFF9F2]">
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{blog?.author?.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{blog?.category?.name}</TableCell>
                      <TableCell className="text-[#4A3728]">{blog?.title}</TableCell>
                      <TableCell className="text-[#8C7B6B]">{blog?.slug}</TableCell>
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{moment(blog?.createdAt).format('DD-MM-YYYY')}</TableCell>
                      <TableCell className="flex gap-3">
                        <Button variant="outline" className="border-[#EADFD3] text-[#4A3728] hover:bg-[#D97748] hover:text-white hover:border-[#D97748]" asChild>
                          <Link to={RouteBlogEdit(blog._id)}>
                            <MdEdit />
                          </Link>
                        </Button>
                        <Button onClick={() => handleDelete(blog._id)} variant="outline" className="border-[#EADFD3] text-[#4A3728] hover:bg-[#D97748] hover:text-white hover:border-[#D97748]">
                          <RiDeleteBinFill />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                  :

                  <TableRow className="border-[#EADFD3]">
                    <TableCell colSpan="6" className="text-[#8C7B6B]">
                      Data not Found
                    </TableCell>
                  </TableRow>

                }
              </TableBody>
            </Table>
          </div>
        </CardContent>

      </Card>
    </div>
  )
}

export default BlogDetails