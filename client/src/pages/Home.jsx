import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from './../components/CallToAction';
import { useState } from 'react'
import PostCard from './../components/PostCard';


const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/post/getPosts')
      const data = await response.json()
      setPosts(data.posts)
    }
    fetchPosts()
  
  }, [])
  return (
    <div>
      <div className=' flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog </h1>
        <p className=' text-gray-500 text-xs sm:text-sm'>
          This is a simple blog app built with the MERN stack. It allows users to create, edit, and delete posts and comments. It also has authentication and authorization features.
        </p>
      <Link to="/search" className=' text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
      Veiw Posts
      </Link>
      </div>
      <div className=' p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className=' max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-bold text-center'>Recent Posts</h2>
              <div className='flex flex-wrap gap-4'>
                {
                  posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))
                }
              </div>
              <Link to="/search" className=' text-lg  text-teal-500 font-bold hover:underline text-center'>
                View All Posts
              </Link>
              
            </div>
          )
        }

      </div>
    </div>
  )
}

export default Home