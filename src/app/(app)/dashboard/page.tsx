'use client'
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, {  useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
const page = () => {
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading,setisLoading] = useState(false);
  const [isSwitchLoading,setIsswitchLoading] = useState(false);

  const {toast} = useToast()

  const handleDeleteMessage = (messageId:string)=>{
    setMessages(messages.filter((message)=>message._id !== messageId))
  }

  const {data:session} = useSession();
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })
  const {register,watch,setValue} = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async()=>{
    setIsswitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue('acceptMessages',response.data.isAccepting
        
      )
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description : axiosError.response?.data.message ||"failed to fetch message setting",
        variant:"destructive"
      })
    }finally{
      setIsswitchLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsswitchLoading(true);
    setIsswitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-messages`)
      console.log(response.data.message)
      setMessages(response.data.messages||[] )
      console.log(messages)
      if(refresh){
        toast({
          title:"Refreshed Messages ",
          description:"Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description : axiosError.response?.data.message ||"failed to fetch message setting",
        variant:"destructive"
      })
    }finally{
      setisLoading(false)
      setIsswitchLoading(false)
    }
  },[setisLoading,setMessages])
  
  
  useEffect(() => {
    console.log("Session data:", session);
   

    if (session && session.user) {
      fetchMessages();
      fetchAcceptMessage();
    } else {
      toast({
        title: "Error",
        description: "User not found. Please log in again.",
        variant: "destructive",
      });
    }
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);
  

  //handle switch change

  const handleSwitchChange = async()=>{
    try {
      const response = await axios.post(`/api/accept-message`,{acceptMessages:!acceptMessages})
      setValue('acceptMessages',!acceptMessages)
      toast({
        title:response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title:"Error",
        description : axiosError.response?.data.message ||"failed to fetch message setting",
        variant:"destructive"
      })
    }
  }

  const username = (session?.user as User)?.username || 'Guest';
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title:"URL copied",
      description:"Profile URL has been copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div>Please Login</div>
  }



  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id }
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page
