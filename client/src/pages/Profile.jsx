import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getEnv } from '@/helpers/getEnv'
import { showToast } from '@/helpers/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from '@/hooks/useFetch'
import Loading from '@/components/Loading'
import { FaCamera } from "react-icons/fa";
import Dropzone from "react-dropzone"
import { setUser } from "@/redux/user/user.slice"

const Profile = () => {

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()

    const user = useSelector((state) => state.user)

    const { data: userData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-user/${user?.user?._id}`,
        { method: 'get', credentials: 'include' }
    );

    const dispath = useDispatch()

    const formSchema = z.object({
        name: z.string().min(3, 'name must be at least 3 character long'),
        email: z.string().email(),
        bio: z.string().min(3, 'name must be at least 3 character long'),

    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            bio: '',
            password: '',
        },
    })


    useEffect(() => {
        if (userData && userData.success) {
            form.reset({
                name: userData.user.name,
                email: userData.user.email,
                bio: userData.user.bio,
            })
        }
    }, [userData])


    async function onSubmit(values) {
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('data', JSON.stringify(values))
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/user/update-user/${userData.user._id}`, {
                method: 'put',
                credentials: 'include',
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                return showToast('error', data.message)
            }
            dispath(setUser(data.user))
            showToast('success', data.message)

        } catch (error) {
            showToast('error', error.message)
        }
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    if (loading) return <Loading />


    return (
        <Card className="max-w-screen-md mx-auto bg-white border-[#EADFD3] shadow-sm">

            <CardContent>
                <div className='flex justify-center items-center mt-10'>
                    <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (

                            <div {...getRootProps()}>
                                <input {...getInputProps()} />

                                <Avatar className="w-28 h-28 relative group">
                                    <AvatarImage
                                        src={filePreview ? filePreview : userData?.user?.avatar}
                                    />
                                    <div className="absolute z-50 w-full h-full top-1/2 left-1/2
                            -translate-x-1/2 -translate-y-1/2  justify-center items-center
                             bg-black bg-opacity-20 border-2 border-[#D97748] rounded-full 
                                 group-hover:flex hidden cursor-pointer">
                                        <FaCamera color='#D97748' />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>


                </div>

                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-[#4A3728]'>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-[#4A3728]'>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-[#4A3728]'>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter Bio" className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-[#4A3728]'>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter your Password" className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className='w-full bg-[#D97748] hover:bg-[#c2663d] text-white'>Save Changes</Button>
                        </form>
                    </Form>
                </div>
            </CardContent>

        </Card>
    )
}

export default Profile