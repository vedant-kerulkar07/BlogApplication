import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'
import { RouteIndex, RouteSignUp } from '@/helpers/RouteName'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/user/user.slice'
import GoogleLogin from '@/components/GoogleLogin'
import logo from "@/assets/images/logo-white.png"

const SignIn = () => {

  const dispath = useDispatch()

  const navigate = useNavigate()
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3, 'Password field required.')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/login`, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (!response.ok) {
        return showToast('error', data.message)
      }
      dispath(setUser(data.user))
      navigate(RouteIndex)
      showToast('success', data.message)

    } catch (error) {
      showToast('error', error.message)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen w-full px-3 bg-[#FFF9F2]'>
      <Card className='p-5 w-full max-w-sm bg-white border-[#EADFD3] shadow-sm'>
        <div className='flex justify-center items-center mb-2'>
          <Link to={RouteIndex}>
            <img src={logo} />
          </Link>
        </div>

        <h1 className='text-xl font-bold text-center mb-5 text-[#4A3728]'>Login Into Account</h1>

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
            <div className='mt-5'>
              <Button type="submit" className='w-full bg-[#D97748] hover:bg-[#c2663d] text-white'>Sign In</Button>
              <div className='mt-5 text-sm flex justify-center items-center gap-2 text-[#4A3728]'>
                <p>Don&apos;t have account?</p>
                <Link className='text-[#D97748] hover:underline' to={RouteSignUp}>Sign Up</Link>
              </div>
            </div>

          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignIn