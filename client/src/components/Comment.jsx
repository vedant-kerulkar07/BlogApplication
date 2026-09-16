import React, { use, useState } from 'react'
import { FaCommentDots } from "react-icons/fa6";
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { RouteSignIn } from '@/helpers/RouteName';
import { Link } from 'react-router-dom';
import CommentList from './CommentList';

const Comment = ({ props }) => {
    const [newComment, setNewComment] = useState()
    const user = useSelector((state) => state.user)
    const formSchema = z.object({
        comment: z.string().min(5, 'comment must be at least 5 character long'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: '',
        },
    })

    async function onSubmit(values) {
        try {
            const newValues = { ...values, blogid: props.blogid, user: user.user._id }
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/comment/add`, {
                method: 'post',
                credentials: 'include',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(newValues)
            })
            const data = await response.json()

            if (!response.ok) {
                return showToast('error', data.message)
            }
            setNewComment(data.comment)
            form.reset()
            showToast('success', data.message)

        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <div className='px-1 sm:px-0'>
            <h4 className='flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#4A3728]'>
                <FaCommentDots className='text-[#D97748]' />Comments
            </h4>

            {user && user.isLoggedIN
                ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 sm:mt-4">
                        <div className='mb-3'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#4A3728]">Comment</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your comment"
                                                className="bg-white border-[#EADFD3] text-[#4A3728] placeholder:text-[#8C7B6B] focus-visible:ring-[#D97748]/40 min-h-[90px] sm:min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto bg-[#D97748] hover:bg-[#c2663d] text-white">
                            Submit
                        </Button>
                    </form>
                </Form>
                :
                <Button asChild className="mt-3 sm:mt-4 w-full sm:w-auto bg-[#D97748] hover:bg-[#c2663d] text-white">
                    <Link to={RouteSignIn}>Please sign in to comment.</Link>
                </Button>
            }

            <div className='mt-5'>
                <CommentList props={{ blogid: props.blogid, newComment }} />
            </div>
        </div>
    )
}

export default Comment