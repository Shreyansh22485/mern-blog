import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess ,signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";


const SignIn = () => {
  const [formData, setFormData] =  useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    // console.log(e.target.value);
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };
  // console.log(formData)
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill all the fields'));
      
    }
    // console.log(formData);
    try{
      dispatch(signInStart());
      const response = await fetch('/api/auth/signin',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if( data.success === false){
        dispatch( signInFailure(data.message));
      }
      if(response.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
      
    }
    catch(err){
      
      dispatch(signInFailure( err.message));
    }
  }
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          {/* left side */}
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Bhallu's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            nesciunt voluptas quia, eaque ipsa temporibus dol
          </p>
        </div>
        <div className="flex-1">
          {/* right side */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            <div>
              <Label  value="Your Email"></Label>
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}

                className="w-full"
                
              ></TextInput>
            </div>
            <div>
              <Label value="Your Password"></Label>
              <TextInput
                type="password"
                placeholder="******"
                id="password"
                onChange={handleChange}
                className="w-full"
              ></TextInput>
            </div>
            <Button gradientDuoTone={"purpleToPink"} pill type="submit" disabled={loading}>
              {
                loading ? (
                  <><Spinner size={'sm'} />
                  <span className="pl-3">
                    Loading ...
                  </span></>
                  
                ) : "Sign In"
              }
            </Button>
            <OAuth />
          </form>
          <div className=" flex gap-2">
            <p className="text-sm mt-5">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
          {
            errorMessage && 
            <Alert type="danger" className="mt-5" color='failure'>
              {errorMessage}
            </Alert>
          }
        </div>
      </div>
    </div>
  );
};

export default SignIn;
