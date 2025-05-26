'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { messageSchema } from '@/schemas/messageSchema'
import {z} from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
const page = () => {
  const params = useParams<{username:string}>()
  const username  = params.username
  const handleMessageClick = (message:string)=>{
    form.setValue('content',message)
  }
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema), defaultValues: {
      content: '',  
    },
  })
  const [isLoading,setIsLoading] = useState(false);
  const onSubmit = async (data: z.infer<typeof messageSchema>) =>{
   setIsLoading(true);
   console.log(data)
    try {
      const response =  await axios.post<ApiResponse>('/api/send-message',{
        ...data,
        username,
      })
      console.log(response)
      toast({
        title: "Message sent successfully",
        description: "Your message has been delivered.",
        variant: "default",
      });
      
      form.reset({ content: '' })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      
    }finally{
      setIsLoading(false)
    }

  }
  const messageContent = form.watch('content')
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
    <h1 className="text-4xl font-bold mb-6 text-center">
      Public Profile Link
    </h1>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
</div>
  )
}

export default page


