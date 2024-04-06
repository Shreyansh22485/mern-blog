import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'



const DashPost = () => {
    const {currentuser} = useSelector((state) => state.user)
    const [userPosts , setUserPosts] = useState([])
    console.log(userPosts)
    useEffect(() => {
        const fetchPosts = async () => {
            try{
                const response = await fetch(`/api/post/getposts?userId=${currentuser._id}`)
                const data = await response.json()
                if( response.ok){
                    setUserPosts(data.posts)
                }
            }
            catch(error){
                console.log(error)
            }
        };
        if(currentuser.isAdmin){
            fetchPosts()
        }
    }, [currentuser._id])
        
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        { currentuser.isAdmin && userPosts.length > 0 ? (
            <>
                <Table hoverable classname ='shadow-md'>
                   <Table.Head>
                          <Table.HeadCell>
                            Date Updated
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Post Image
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Post title
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Category
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Delete
                          </Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit </span>
                             </Table.HeadCell>

                            

                   </Table.Head>
                   {userPosts.map((post) => (
                       <Table.Body classname = 'divide-y'>
                           <Table.Row key={post._id} className=' bg-white dark:border-gray-700 dark:bg-gray-800'>
                               <Table.Cell>
                                   {new Date(post.updatedAt).toLocaleDateString()}
                               </Table.Cell>
                               <Table.Cell>
                               <Link to = {`/post/${post.slug}` } >
                                   <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                                 </Link>
                               </Table.Cell>
                               <Table.Cell>
                               <Link className='font-medium text-gray-900 dark:text-white'
                                      to={`/post/${post.slug}`}>

                                   {post.title}

                               </Link>
                               </Table.Cell>
                               <Table.Cell>
                                   {post.category}
                               </Table.Cell>
                               <Table.Cell>
                                   <Button
                                   color='failure'
                                   >Delete</Button>
                               </Table.Cell>
                               <Table.Cell>
                                    <Link to={`/update-post/${post._id}`} >

                                   <Button className='bg-blue-500 text-white px-2 py-1 rounded-md' 
                                     
                                   >Edit</Button>
                                   </Link>
                               </Table.Cell>
                           </Table.Row>
                       </Table.Body>
                   ))}

                </Table> 
            </>
        ):(
            <>
                <h1 className='text-2xl font-bold'>No Posts Found</h1>
                <p className="text-lg">You have not created any posts yet</p>
            </>
        )
        }
    </div>
  )
}

export default DashPost