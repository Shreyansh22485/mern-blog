import React from 'react'
import { useSelector } from 'react-redux' 
import { Outlet, Navigate} from "react-router-dom";


const OnlyAdimnPrivateRoute = () => {
    const { currentuser } = useSelector((state) => state.user);
  return (currentuser &&  currentuser.isAdmin ? <Outlet /> :
    <Navigate to="/sign-in" />
  )
}

export default OnlyAdimnPrivateRoute