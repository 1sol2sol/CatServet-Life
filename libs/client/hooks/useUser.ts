import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface profileResponse {
  ok: boolean;
  profile: User;
}

export default function useUser(){
  const {data, error} = useSWR<profileResponse>("/api/users/me")
  console.log(data);
  
  const router = useRouter();
  useEffect(() => {
    if(data && !data.ok && router.pathname !== `/enter` && router.pathname !== `/login`){
      router.replace("/enter");
    }
    
  }, [data, router])

  return {user: data?.profile, isLoading: !data && !error};
}