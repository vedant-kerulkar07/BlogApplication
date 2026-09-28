import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
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
import { RiDeleteBinFill } from "react-icons/ri";
import { showToast } from '@/helpers/showToast'
import { deleteData } from '@/helpers/handleDelete'
import { comment } from 'postcss'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
const User = () => {

  const [refreshData, setRefreshData] = useState(false)

  const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-all-user`, {
    method: 'get',
    credentials: 'include'
  }, [refreshData])

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/user/delete/${id}`)
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
              <TableCaption className="text-[#8C7B6B]">A list of your recent invoices....</TableCaption>
              <TableHeader>
                <TableRow className="border-[#EADFD3] hover:bg-[#FFF9F2]">
                  <TableHead className="text-[#4A3728]">Role</TableHead>
                  <TableHead className="text-[#4A3728]">Name</TableHead>
                  <TableHead className="text-[#4A3728]">Email</TableHead>
                  <TableHead className="text-[#4A3728]">Avatar</TableHead>
                  <TableHead className="text-[#4A3728]">Dated</TableHead>
                  <TableHead className="text-[#4A3728]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.user.length > 0 ?

                  data.user.map(user =>
                    <TableRow key={user._id} className="border-[#EADFD3] hover:bg-[#FFF9F2]">
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{user.role}</TableCell>
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{user.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-[#8C7B6B]">{user.email}</TableCell>
                      <TableCell>
                        <img src={user.avatar || usericon} className='w-10 h-10 rounded-full object-cover' />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-[#4A3728]">{moment(user.createdAt).format('DD-MM-YYYY')}</TableCell>
                      <TableCell className="flex gap-3">
                        <Button onClick={() => handleDelete(user._id)} variant="outline" className="border-[#EADFD3] text-[#4A3728] hover:bg-[#D97748] hover:text-white hover:border-[#D97748]">
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

export default User