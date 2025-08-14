import { useState } from "react";
import { AuthContext } from ".";
import { getAuthenticatedUser, refreshAccessToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { LazyLoader } from "@/components/LazyLoader";

export default function AuthProvider({ children }) {
  //set and save accesstoken in state memory
  const [accessToken, setAccessToken] = useState(null); //the moment we save the accessToken, it will be available in the state memory
  const [user, setUser] = useState(null); //default value of logged in user , and we set and save it in state memory
  const [isAuthenticating, setIsAuthenticating] = useState(false); 

  // query to refresh access token on app start
  useQuery({
    queryKey: ["refresh_token"], // cache key for our api call and Acts as an ID for React Query’s cache and query tracking.
    queryFn: async () => {
       setIsAuthenticating(true);
      const res = await refreshAccessToken();
      // make api calls to get new accessToken, then update it inour own accessToken state using setAccessToken setter function
      if (res.status === 200) {
        const newAccessToken = res.data?.data?.accessToken;
        setAccessToken(newAccessToken); // update accessToken state
         setIsAuthenticating(false); // we are doing this because we want to show the lazy loader when we are trying to authenticate to false
        return res;
      } else {
        setAccessToken(null); //if res,status is not 200, set accessToken to null or remove the accessToken and force a logout
         setIsAuthenticating(false); //we are doing this because we want to show the lazy loader when we are trying to authenticate to false
        return null;
      }
    },
    enabled: !accessToken, // ensure it runs only when we don't have an accessToken, because that is when we need to refresh it
    retry: false, //don't run or retry this query if the queryFn fails
  });

  // fetching authenticated user data- 2 ways to use the useQuery hook either by destructuring the data or by using the data property
  //fetch auth user
  useQuery({
    queryKey: ["auth_user"], //cache key for our api call /cache key for our api call, it prevents multiple api calls and also helps us to cache the data and its done automatically
    queryFn: async () => {
        setIsAuthenticating(true) // for when we are trying to authenticate to true
      //this is the function that will be called to fetch the data, normally we will use the useEffect hook for this but with react-query we can use the useQuery hook to fetch data
      const res = await getAuthenticatedUser(accessToken);
      if (res.status === 200) {
        setUser(res.data?.data);
         setIsAuthenticating(false) //set is autheticating to false because we have gotten our user
        return res ;
      } // hold the value from our res in the user state
      setIsAuthenticating(false) 
      return null ;
    },
    onError: (error) => {
      console.error(" Error fetching user", error);
    },
    enabled: !!accessToken, //run only when we have the accessToken
  });

  console.log(user);
  console.log(accessToken);

  if (isAuthenticating) {
    return <LazyLoader />;
  }


  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
