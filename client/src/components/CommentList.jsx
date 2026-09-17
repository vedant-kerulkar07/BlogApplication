import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { Avatar } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { getEnv } from '@/helpers/getEnv'

const CommentList = ({ props }) => {
    const user = useSelector(state => state.user)
    const { data, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/comment/get/${props.blogid}`, {
        method: 'get',
        credentials: 'include',
    })

    if (loading) return <div className="text-[#8C7B6B] text-sm">Loading...</div>

    return (
        <div>
            <h4 className='text-xl sm:text-2xl font-bold text-[#4A3728]'>
                {
                    props.newComment ?
                        <span className='me-2'>{data && data.comments.length + 1}</span>
                        :
                        <span className='me-2'>{data && data.comments.length}</span>
                }
                Comments
            </h4>

            <div className='mt-4 sm:mt-5 divide-y divide-[#EADFD3]'>

                {props.newComment &&
                    <div className='flex gap-2 sm:gap-3 py-3 first:pt-0'>
                        <Avatar className="shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                            <AvatarImage src={user?.user?.avatar || usericon} className="rounded-full object-cover w-full h-full" />
                        </Avatar>

                        <div className="min-w-0">
                            <p className='font-bold text-sm sm:text-base text-[#4A3728] truncate'>{user?.user?.name}</p>
                            <p className="text-xs sm:text-sm text-[#8C7B6B]">{moment(props.newComment?.createdAt).format('DD-MM-YYYY')}</p>
                            <div className='pt-2 sm:pt-3 text-sm sm:text-base text-[#4A3728] break-words'>
                                {props.newComment?.comment}
                            </div>
                        </div>
                    </div>
                }

                {data && data.comments.length > 0 &&
                    data.comments.map(comment => (
                        <div key={comment._id} className='flex gap-2 sm:gap-3 py-3 first:pt-0'>
                            <Avatar className="shrink-0 h-8 w-8 sm:h-9 sm:w-9">
                                <AvatarImage src={comment?.user?.avatar || usericon} className="rounded-full object-cover w-full h-full" />
                            </Avatar>

                            <div className="min-w-0">
                                <p className='font-bold text-sm sm:text-base text-[#4A3728] truncate'>{comment?.user?.name || 'Deleted user'}</p>
                                <p className="text-xs sm:text-sm text-[#8C7B6B]">{moment(comment?.createdAt).format('DD-MM-YYYY')}</p>
                                <div className='pt-2 sm:pt-3 text-sm sm:text-base text-[#4A3728] break-words'>
                                    {comment?.comment}
                                </div>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default CommentList