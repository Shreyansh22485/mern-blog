import { set } from 'mongoose';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import CallToAction from '../components/CallToAction';


const PostPage = () => {
  const { postSlug } =  useParams();
  const [loading, setLoading] = useState(true);
  const [error , setError] = useState(null);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await response.json();
        if (response.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(null);
        } else {
          setError(data.message);
          setLoading(false);
          return;
        }
        
      } catch (error) {
        setError(error.message);
        setLoading(false);
        
      }
    }
    fetchPost();
    
  }, [postSlug]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size = 'xl' color='blue.500' />
      </div>
    )
  }
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen '>
      <h1 className=' text-3xl mt-10 p-3 text-center font-serif max-x-2xl mx-auto lg:text-4xl'>{
        post && post.title
      }</h1>
      <Link to={`/search?category=${post && post.category}`}
      className=' self-center mt-5'>
      <Button className='mt-5' color='gray' size='xs'>{post && post.category}</Button>
       </Link>
      <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 w-full max-h-[600px] object-cover' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto  w-full maxw2xl text-xs'>
        <span>
          {post && new Date(post.createdAt).toLocaleDateString()}

        </span>
        <span>
          {post && (post.content.length/1000).toFixed(0)} mins read
        </span>
      </div>
      <div
       className='p-3 max-w-2xl mx-auto w-full post-content'
       dangerouslySetInnerHTML={{__html: post && post.content}}>
      </div>
      <div className='max-w-4xl mx-auto w-full'>
          <CallToAction />
      </div>

    </main>
    
  )
}

export default PostPage