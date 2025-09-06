import { useState, useEffect } from "react";
import { AuthContext } from ".";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/components/LazyLoader";

export default function AuthProvider({ children }) {
  //set and save accesstoken in state memory
  const [accessToken, setAccessToken] = useState(null); //the moment we save the accessToken, it will be available in the state memory
  const [user, setUser] = useState(null); //default value of logged in user , and we set and save it in state memory
  // const [isAuthenticating, setIsAuthenticating] = useState(false); 



   //fetch refresh token user
  const { isPending: isLoading, data: dataToken } = useQuery({
    queryKey: ["refresh_token"], // cache key for our api call and Acts as an ID for React Query’s cache and query tracking.
          queryFn:  () =>  refreshAccessToken(),
           onError: async (error) => {
        console.error("Error refreshing accessToken", error);
        setAccessToken(null); //if error occurs while refreshing token, set accessToken to null or remove the accessToken and force a logout
      },
      enabled: !accessToken,  // ensure it runs only when we don't have an accessToken, because that is when we need to refresh it
      retry: false,
    });
      

     //set newaccessToken data
   useEffect(() => {
     if (dataToken?.status === 200) {
       const newAccessToken = dataToken?.data?.data?.accessToken;
       setAccessToken(newAccessToken);
     }
   }, [dataToken?.data?.data?.accessToken, dataToken?.status]);

  // fetching authenticated user data- 2 ways to use the useQuery hook either by destructuring the data or by using the data property
  //fetch auth user
  const { isPending, data } = useQuery({
    queryKey: ["auth_user", accessToken],
    queryFn: () => getAuthenticatedUser(accessToken),
    onError: async (error) => {
      console.error("Error fetching user", error);
    },
    enabled: !!accessToken,
  });

  //set user data
  useEffect(() => {
    if (data?.status === 200) {
      setUser(data?.data?.data);
    }
  }, [data?.data?.data, data?.status]);

  if ((isPending && accessToken) || isLoading) {
    return <LazyLoader />;
  }


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
