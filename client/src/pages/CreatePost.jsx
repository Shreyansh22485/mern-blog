import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { app } from '../firebase';
import { getStorage } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';


const CreatePost = () => {
    const [file , setFile] = useState(null);
    // const [imageFileUrl , setImageFileUrl] = useState(null);
    const [progressImage , setProgressImage] = useState(null);
    const [imageError , setImageError] = useState(null);
    const [formData , setFormData] = useState({});
    const [publishError , setPublishError] = useState(null);
    const navigate = useNavigate();

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageError('Please select an image');
                return;
            }
            setImageError(null)
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgressImage(progress.toFixed(0));
              }, (error) => {
                setImageError('Image can not be uploded');
                // setImageUploading(false)
                setProgressImage(null)
                // setImageFile( null)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // setImageFileUrl(downloadURL);
                    // setImageUploading(false);
                    setProgressImage(null);
                    setImageError(null)
                    // setImageFile(null);
                    setFormData({...formData, image: downloadURL});
                });
            });
            

            
        } catch (error) {
            setImageError( 'Image can not be uploaded')
            setProgressImage(null)
            console.log(error)
            
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('/api/post/create-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                setPublishError(data.message);
                return;
            }
            
            setPublishError(null);
            navigate( `/post/${data.post.slug}`);
        }
        catch (error) {
            setPublishError('Post can not be created');
            // console.log(error);
        }    
    }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Create Post</h1>
        <form className='flex flex-col space-y-5 gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput type='text' label='Title' placeholder='Enter title' required id='title' className='flex-1' onChange={ (e) => setFormData( {
                    ...formData, title: e.target.value
                } )  } />
                <Select label='Category' id='category' className='flex-1' required onChange={(e) =>
                    setFormData({
                        ...formData,
                        category: e.target.value
                    })
                } >
                    <option value='uncategorized'>Choose a category</option>
                    <option value='programming'>Programming</option>
                    <option value='design'>Design</option>
                    <option value='life'>Life</option>
                    
                </Select>

            </div>
            <div className='flex  gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 ' >
                <FileInput type='file' label='Upload Image' id='image' accept='image/*' onChange={(e)=> setFile(e.target.files[0]) } disabled={progressImage} />
                <Button type='button' className=' text-white rounded-lg' gradientDuoTone={'purpleToBlue'} size={'sm'} onClick={handleUploadImage} outline>
                {progressImage ? <div className='w-12 h-12 relative'>
                    <CircularProgressbar value={progressImage} text={`${progressImage || 0}%`} />
                </div> : "Upload"}
                </Button>
            </div>
            {imageError &&
            <Alert color='failure'>
                {imageError}
            </Alert> 
            }
            {formData.image && (
                <img src={formData.image} alt='post' className='w-full h-72 object-cover' />
            )}
            <ReactQuill theme='snow' id='content' placeholder='Write something amazing...' className='h-72 mb-12' required onChange={
                (value) => setFormData({
                    ...formData,
                    content: value
                })
            
            } />


            <Button type='submit' gradientDuoTone={'purpleToPink'}>Publish</Button>
            {publishError && (
                <Alert color='failure'>
                    {publishError}
                </Alert>
            )}
        </form>

    </div>
  )
}

export default CreatePost