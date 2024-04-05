import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart , updateSuccess, updateFailure , deleteUserStart, deleteUserSuccess, deleteUserFailure , signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
const DashProfile = () => {
    const { currentuser, error , loading } = useSelector((state) => state.user);
    const [ imageFile , setImageFile] = useState(null);
    const [ imageFileUrl , setImageFileUrl] = useState(null);
    const [ progressImage , setProgressImage] = useState(null);
    const [ imageError , setImageError] = useState(null);
    const [ imageuploading , setImageUploading] = useState(false);
    const [ updateUserSuccess , setUpdateUserSuccess] = useState(null);
    const [ updateUserError , setUpdateUserError] = useState(null);
    const [ showModal , setShowModal] = useState(false);
    const [ formData , setFormData] = useState({});
    const dispatch = useDispatch();

    // console.log( progressImage, imageError)
    const fileRef = useRef();
    const handleImage = (e) => {
        const file = e.target.files[0];
        if( !file) return;
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
        // console.log(file);
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //     currentuser.profilePhoto = reader.result;
        // }
        // reader.readAsDataURL(file);
    }
    useEffect(() => {
        if( imageFile) {
            uploadImage();
        }
    }, [imageFile])
        
    const uploadImage = async () => {
        setImageUploading(true)
        setImageError(null)
        const storage=getStorage(app)
        const fileName= new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName); 
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgressImage(progress.toFixed(0));
          }, (error) => {
            setImageError('Image can not be uploded');
            setImageUploading(false)
            setProgressImage(null)
            setImageFile( null)
            setImageFileUrl( null)
          }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageFileUrl(downloadURL);
                setFormData ({...formData, profilePhoto: downloadURL})
                setImageUploading(false)
                // currentuser.profilePhoto = downloadURL;
            });
          }
        );
    };
    
    const handleChange = (e) => {
        setFormData ({...formData, [e.target.id]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        if(Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made')
            return;}
        if( imageuploading){
            setUpdateUserError('Image is still uploading')
            return;
        } 

        try {
            dispatch( updateStart());
            const response = await fetch(`/api/user/update/${currentuser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if(! response.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)

            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess('User updated successfully')
            }
            
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
            
        }
    }
    const handleDeleteUser = async () => {
        setShowModal(false) 

        try {
            dispatch(deleteUserStart());
            const response = await fetch(`/api/user/delete/${currentuser._id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if(!response.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess())
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))

        }
    }
    const handleSignOUt = async () => {
        try {
            const response = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await response.json();
            if(!response.ok) {
                console.log(data.message)
            }
            else{
                dispatch(signOutSuccess())
            }

        } catch (error) {
            console.log(error)
        }
    }
    

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' hidden id='profilePhoto' accept='image/*' onChange={handleImage} ref={fileRef} />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={ 
            () => fileRef.current.click()
        }>
            {progressImage && (
                <CircularProgressbar value={progressImage || 0} text={`${progressImage}%`} 
                strokeWidth={5}
                styles={{
                    root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0},
                    path: { stroke: `rgba(62,152,199,${progressImage/100})` },
                    text: { fill: '#4B5563', fontSize: '1.5rem' }
                }}
                />
            )}

            <img src={imageFileUrl || currentuser.profilePhoto} alt={currentuser.displayName} className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
                progressImage && progressImage <100 && 'opacity-50'
            
            }`} />
        </div>
        { imageError && (
            <Alert color={'failure'}>
                {imageError}

            </Alert>
        )}

        <TextInput type='text' label='Name' id='username' placeholder={'username'} defaultValue={currentuser.username}  onChange={handleChange}  />
        <TextInput type='email' label='Email' id='email' placeholder={'email'} defaultValue={currentuser.email} onChange={handleChange} />
        <TextInput type='password' label='Password' id='password' placeholder={'password'} onChange={handleChange} />
        <Button type='submit' className='w-full mt-4' gradientDuoTone={'purpleToBlue'} outline disabled ={ loading || imageuploading} >
            {loading ? 'Loading...' : 'Update'}
        </Button>
        {
            currentuser.isAdmin && (
                <Link  to="/create-post" >

                <Button
                className='w-full mt-4' 
                type='button'
                gradientDuoTone={'purpleToPink'}
                outline>
                     Create Post
                </Button>
                </Link>
            )
                
        }
        </form>
        <div className="text-red-500 flex justify-between mt-5">
        <span onClick={()=> setShowModal(true) } className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOUt} className='cursor-pointer'>Sign Out</span>
    

        </div>
        { updateUserSuccess && (
            <Alert color={'success'}>
                {updateUserSuccess}
            </Alert>
        )}
        { updateUserError && (
            <Alert color={'failure'}>
                {updateUserError}
            </Alert>
        )}
        { error && (
            <Alert color={'failure'}>
                {error}
            </Alert>
        )}


        <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
            <Modal.Header>
                {/* <h3 className='text-xl font-semibold'>Delete Account</h3> */}
            </Modal.Header>
            <Modal.Body>
            <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                <p>Are you sure you want to delete your account?</p>
                <p>This action cannot be undone.</p>
            </div>
            <div>
                <Button className='w-full mt-4' color = {'failure'} onClick={handleDeleteUser} >Delete Account</Button>
                <Button className='w-full mt-4' outline onClick={() => setShowModal(false)}>Cancel</Button>
            </div>

            </Modal.Body>
            
        </Modal>
    </div>
  )
}

export default DashProfile