import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { RouteSignIn } from '@/helpers/RouteName'
import { getEnv } from '@/helpers/getEnv'
import { showToast } from '@/helpers/showToast'
import GoogleLogin from '@/components/GoogleLogin'
const SignUp = () => {

  const navigate = useNavigate()

  const formSchema = z.object({
    name: z.string().min(5, 'name must be at least 5 character long'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 character long'),
    confirmpassword: z.string()
  })
    .refine((data) => data.password === data.confirmpassword, {
      path: ['confirmpassword'], // Field to show the error on
      message: 'Password and confirm password should be the same',
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: '',
    },
  })

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values)
      })
      const data = await response.json()

      if (!response.ok) {
        return showToast('error', data.message)
      }

      navigate(RouteSignIn)
      showToast('success', data.message)

    } catch (error) {
      showToast('error', error.message)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen w-full px-3 py-8 bg-[#FFF9F2]'>
      <Card className='w-full max-w-sm p-5 bg-white border-[#EADFD3] shadow-sm'>
        <h1 className='text-xl font-bold text-center mb-5 text-[#4A3728]'>Create Your Account</h1>

        <div className=''>
          <GoogleLogin />
          <div className='relative border-t border-[#EADFD3] my-5 flex justify-center items-center'>
            <span className='absolute bg-white text-sm px-2 text-[#8C7B6B]'>Or</span>
          </div>
        </div>

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
            <div className='mb-3'>
              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-[#4A3728]'> Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password again " className='border-[#EADFD3] focus-visible:ring-[#D97748]/30 text-[#4A3728]' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='mt-5'>
              <Button type="submit" className='w-full bg-[#D97748] hover:bg-[#c2663d] text-white'>Sign Up</Button>
              <div className='mt-5 text-sm flex justify-center items-center gap-2 text-[#4A3728]'>
                <p>Already have account?</p>
                <Link className='text-[#D97748] hover:underline' to={RouteSignIn}>Sign In</Link>
              </div>
            </div>

          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignUp