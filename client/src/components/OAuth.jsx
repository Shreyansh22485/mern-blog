import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'


const OAuth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters( { prompt: 'select_account'})

        try {
            const results = await signInWithPopup(auth, provider)
            const res = await fetch('api/auth/google' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name : results.user.displayName,
                    email: results.user.email, 
                    photo: results.user.photoURL
                    
                    })
            })
            const data = await res.json()
            
            if (!res.ok) throw new Error(data.message || 'Something went wrong')
            else{
        dispatch(signInSuccess(data)) 
        navigate('/')}
            
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button className="" 
    type=' button'
    pill
    gradientDuoTone={"pinkToOrange"} outline
    onClick={ handleGoogle}
    >
        <AiFillGoogleCircle
        size={25}
        style={{ marginRight: "4px",  }}
          /> Sign In with Google</Button>
    
    
  )
}

export default OAuth