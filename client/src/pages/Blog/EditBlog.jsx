import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'
import { decode } from 'entities'
import Loading from '@/components/Loading'


const EditBlog = () => {
  const { blogid } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const { data: categoryData } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
    method: 'get',
    Credential: 'include'
  })

  const { date: blogData, loading: blogLoading } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/edit/${blogid}`, {
    method: 'get',
    Credential: 'include'
  }, [blogid])
  const [filePreview, setPreview] = useState()
  const [file, setFile] = useState()

  const formSchema = z.object({
    category: z.string(),
    title: z.string().min(3, 'Title must be at least 3 character long'),
    slug: z.string().min(3, 'slug must be at least 3 character long'),
    blogContent: z.string().min(3, 'Blog content must be at least 3 character long'),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      title: '',
      slug: '',
      blogContent: '',

    },
  })

  useEffect(() => {
    if (blogData) {
      setPreview(blogData.blog.featuredImage)
      form.setValue('category', blogData.blog.category._id)
      form.setValue('title', blogData.blog.title)
      form.setValue('title', blogData.blog.title)
      form.setValue('slug', blogData.blog.slug)
      form.setValue('blogContent', decode(blogData.blog.blogContent))

    }
  })


  const handleEditorData = (event, editor) => {
    const data = editor.getData()
    form.setValue('blogContent', data)
  }

  const blogTitle = form.watch('title')

  useEffect(() => {

    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true })
      form.setValue('slug', slug)
    }
  }, [blogTitle])

  async function onSubmit(values) {
    try {

      const formData = new FormData()
      formData.append('file', file)
      formData.append('data', JSON.stringify(values))
      const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/blog/update/${blogid}`, {
        method: 'put',
        credentials: 'include',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        return showToast('error', data.message)
      }
      form.reset()
      setFile()
      setPreview()
      navigate(RouteBlog)
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
  if (blogLoading) return <Loading />
  return (
    <div className='px-3 sm:px-0'>
      <Card className='pt-5 bg-white border-[#EADFD3] shadow-sm'>
        <CardContent>
          <h1 className='text-xl sm:text-2xl font-bold mb-4 text-[#4A3728]'>Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#4A3728]'>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className='border-[#EADFD3] focus:ring-[#D97748]/30 text-[#4A3728]'>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className='bg-white border-[#EADFD3]'>
                            {categoryData && categoryData.category.length > 0 && categoryData.category.map(category =>
                              <SelectItem key={category._id} value={category._id} className='text-[#4A3728] focus:bg-[#FFF9F2] focus:text-[#D97748]'>{category.name}</SelectItem>
                            )}


                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#4A3728]'>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your title" className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#4A3728]'>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Slug" className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5'>
                <span className='mb-2 block font-medium text-[#4A3728]'>Featured Image</span>
                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                  {({ getRootProps, getInputProps }) => (

                    <div {...getRootProps()} className='cursor-pointer'>
                      <input {...getInputProps()} />
                      <div className='flex justify-center items-center w-full sm:w-36 h-28 border-2 border-dashed border-[#EADFD3] hover:border-[#D97748]/50 transition-colors rounded overflow-hidden bg-[#FFF9F2]'>
                        <img src={filePreview} className='w-full h-full object-cover' />
                      </div>
                    </div>
                  )}
                </Dropzone>
                <div className='mt-5'>
                  <FormField
                    control={form.control}
                    name="BlogContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#4A3728]'>Blog Content</FormLabel>
                        <FormControl>
                          <Editor props={{ initialData: field.value, onChange: handleEditorData }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>
              </div>
              <Button type="submit" className="w-full bg-[#D97748] hover:bg-[#c2663d] text-white">Submit</Button>
            </form>
          </Form>
        </CardContent>

      </Card>
    </div>

  )
}

export default EditBlog