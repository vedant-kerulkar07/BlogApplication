import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory } from '@/helpers/RouteName'
import React, { useState } from 'react'
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
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { MdEdit } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import { showToast } from '@/helpers/showToast'
import { deleteData } from '@/helpers/handleDelete'
import { comment } from 'postcss'

const Comments = () => {

  const [refreshData, setRefreshData] = useState(false)

  const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/comment/get-all-comment`, {
    method: 'get',
    credentials: 'include'
  }, [refreshData])

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/comment/delete/${id}`)
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
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption className="text-[#8C7B6B]">A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow className="border-[#EADFD3] hover:bg-[#FFF9F2]">
                  <TableHead className="text-[#4A3728]">Blog</TableHead>
                  <TableHead className="text-[#4A3728]">Comment By</TableHead>
                  <TableHead className="text-[#4A3728]">Comment</TableHead>
                  <TableHead className="text-[#4A3728]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.comments.length > 0 ?

                  data.comments.map(comment =>
                    <TableRow key={comment._id} className="border-[#EADFD3] hover:bg-[#FFF9F2]">
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{comment?.blogid?.title}</TableCell>
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{comment?.user?.name || 'Deleted user'}</TableCell>
                      <TableCell className="text-[#4A3728]">{comment?.comment}</TableCell>
                      <TableCell className="flex gap-3">
                        <Button onClick={() => handleDelete(comment._id)} variant="outline" className="border-[#EADFD3] text-[#4A3728] hover:bg-[#D97748] hover:text-white hover:border-[#D97748]">
                          <RiDeleteBinFill />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                  :

                  <TableRow className="border-[#EADFD3]">
                    <TableCell colSpan="4" className="text-[#8C7B6B]">
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

export default Comments