import React, { useEffect , useState  } from 'react'
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { Textarea } from 'flowbite-react';
import { Button } from 'flowbite-react';

import { useSelector } from 'react-redux';




const Comment = ({comment,onLike,onEdit,onDelete}) => {
    const [user, setUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [newComment, setNewComment] = useState(comment.content);
    const {currentuser} = useSelector(state => state.user);
    

    useEffect(() => {
        // console.log(comment);
        const getUser = async () => {
            try {
                const response = await fetch(`/api/user/${comment.userId}`);
                const data = await response.json();
                if(response.ok) {
                    // console.log(data);
                    setUser(data);
                } else {
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment])

    const handleEdit = () => {
        setEditMode(true);
        setNewComment(comment.content);

    }
    const handleSave = async () => {
        try {
            const response = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newComment,
                }),
            });
            const data = await response.json();
            if(response.ok) {
                onEdit(comment,newComment);
                setEditMode(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
        <div className=' flex-shrink-0 mr-3'>
            <img className='w-10 h-10 rounded-full bg-gray-200'
             src={user.profilePicture} alt="profile" />
        </div>
        <div className='flex-1'>
            <div className=' flex items-center mb-1'>
                <span className='font-bold text-xs mr-1 truncate '
                >{user ? `@${user.username}`: "Anonymous user" }</span>
                <span className='text-xs text-gray-500'
                >
                    {moment(comment.createdAt).fromNow()}
                </span>
            </div>
            {editMode ? (
                <>
                   <Textarea className='mb-2'

                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                 />
                 <div className='flex justify-end gap-2 text-xs'>
                        <Button type='submit' className='' size={'sm'} gradientDuoTone={'purpleToBlue'}  onClick={handleSave}   >Save</Button>
                        <Button type='submit' className='' size={'sm'} gradientDuoTone={'purpleToBlue'} outline onClick={() => setEditMode(false)}   >Cancel</Button>
                </div>
                </>
                
            ) : (
                <>
                   <p className='text-gray-500 pb-2'>{comment.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700  max-w-fit gap-2'>
                <button type='button' onClick={() => onLike(comment._id)}
                className= {`text-xs text-gray-500 hover:text-blue-500 flex items-center gap-2 ${ currentuser && comment.likes.includes(currentuser._id) && '!text-blue-500'  }`}>
                    <FaThumbsUp className='text-sm' />
                </button>
                <p className=' text-gray-400'>
                    {comment.numberOfLikes>0 && comment.numberOfLikes + ' ' + (comment.numberOfLikes > 1 ? 'likes' : 'like')} 
                </p>
                {
                    currentuser && (currentuser._id === comment.userId || currentuser.isAdmin )  && (
                        <>
                        <button type='button' className='text-gray-500 hover:text-blue-500'onClick={handleEdit}
                        >Edit</button>
                        <button type='button' className='text-gray-500 hover:text-red-500'onClick={() => onDelete(comment._id)}
                        >Delete</button>
                        </>
                        
                    )
                }

            </div> 
                </>
                
            )
            }
            
        </div>
    </div>
  )
}

export default Comment