import React, { useEffect } from 'react'
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

const AddCategory = () => {

  const formSchema = z.object({
    name: z.string().min(5, 'name must be at least 5 character long'),
    slug: z.string().min(5, 'slug must be at least 5 character long'),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',

    },
  })
  const categoryName = form.watch('name')
  useEffect(() => {

    if (categoryName) {
      const slug = slugify(categoryName, { lower: true })
      form.setValue('slug', slug)
    }
  }, [categoryName])

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/add`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await response.json()

      if (!response.ok) {
        return showToast('error', data.message)
      }

      form.reset()
      showToast('success', data.message)

    } catch (error) {
      showToast('error', error.message)
    }
  }


  return (
    <div className='px-3 sm:px-0'>
      <Card className='pt-5 max-w-screen-md mx-auto bg-white border-[#EADFD3] shadow-sm'>
        <CardContent>
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
              <Button type="submit" className="w-full bg-[#D97748] hover:bg-[#c2663d] text-white">Submit</Button>
            </form>
          </Form>
        </CardContent>

      </Card>
    </div>

  )
}

export default AddCategory