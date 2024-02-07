import { Button, TextInput } from 'flowbite-react';
import React from 'react'
import { useSelector } from 'react-redux'

const DashProfile = () => {
    const { currentuser } = useSelector((state) => state.user);
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>

            <img src={currentuser.profilePhoto} alt={currentuser.displayName} className='rounded-full w-full h-full border-8 border-[lightgray] object-cover' />
        </div>
        <TextInput type='text' label='Name' id='username' placeholder={'username'} defaultValue={currentuser.username}  />
        <TextInput type='email' label='Email' id='email' placeholder={'email'} defaultValue={currentuser.email} />
        <TextInput type='password' label='Password' id='password' placeholder={'password'} />
        <Button type='submit' className='w-full mt-4' gradientDuoTone={'purpleToBlue'} outline>Save</Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
    

        </div>
    </div>
  )
}

export default DashProfile