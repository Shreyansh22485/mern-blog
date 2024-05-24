import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {Alert, Button, Textarea} from 'flowbite-react'
import { useState } from 'react';


const CommentSection = (postId) => {
    const {currentuser} = useSelector(state => state.user);
    const [comment , setComment] = useState('');
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(postId.postId);
        try {
            const response = await fetch('/api/comment/create',{ 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postId.postId,
                    userId: currentuser._id,
                    content: comment,
                }),
            });
            const data = await response.json();
    
            if (response.ok) {
                // console.log(data);
                setComment('');
                setError(null);
            } else {
                setError(data.message);
                // console.log(data.message);
            }
            
        } catch (error) {
            setError(error.message);
            console.log(error.message);
            
        }
        


    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currentuser ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm' >
            <p>Signed in as</p>
            <img className='h-5 w-5 object-cover rounded-full' src={ currentuser.profilePic} alt={currentuser.username} />
            <Link to='/dashboard?tab=profile' className='text-xs text-blue-500 hover:underline'
            >@{currentuser.username}</Link>
            </div>
        ) : (
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
                <p>Sign in to comment</p>
                <Link to='/sign-in' className=' text-blue-500 hover:underline'>Sign in</Link>
                
            </div>
        )
            }
            {currentuser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea placeholder='Add a comment' rows='3' maxLength= '200'
                    onChange={(e) => setComment(e.target.value)} 
                    value={comment}
                     />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-xs text-gray-500'>{ 200-comment.length  } characters remaining</p>
                    <Button className='mt-3' gradientDuoTone='purpleToBlue' outline type='submit'>Post Comment</Button>
                    </div>
                    {error && (
                        <Alert className='mt-3' color='failure'>{error}</Alert>
                    )}
                </form>
            )}
    </div>
  )
}

export default CommentSection