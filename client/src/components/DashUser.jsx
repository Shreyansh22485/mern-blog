import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa'



const DashUser = () => {
    const {currentuser} = useSelector((state) => state.user)
    const [users , setUsers] = useState([])
    const [showMore , setShowMore] = useState(true)
    const [showModal , setShowModal] = useState(false)
    const [userIdToDelete , setUserIdToDelete] = useState('')
    
    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const response = await fetch(`/api/user/getusers`)
                const data = await response.json()
                if( response.ok){
                    setUsers(data.users)
                    if(data.users.length < 9){
                        setShowMore(false)
                    }
                }
            }
            catch(error){
                console.log(error)
            }
        };
        if(currentuser.isAdmin){
            fetchUsers()
        }
    }, [currentuser._id])
    const handleShowMore = async () => {

        const startIndex = users.length;
        try{
            
            const response = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
            const data = await response.json()
            if(response.ok){
                setUsers((prev) => [...prev, ...data.users])
                if(data.users.length < 9){
                    setShowMore(false)
                }
            }
        }
        catch(error){
            console.log(error)
        }
    }
    const handleDeleteUser = async () => {
    }
      
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        { currentuser.isAdmin && users.length > 0 ? (
            <>
                <Table hoverable className ='shadow-md'>
                   <Table.Head>
                          <Table.HeadCell>
                            Date Created
                          </Table.HeadCell>
                          <Table.HeadCell>
                            User Image
                          </Table.HeadCell>
                          <Table.HeadCell>
                            User Name
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Email
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Admin
                          </Table.HeadCell>
                          <Table.HeadCell>
                            Delete
                          </Table.HeadCell>
                            

                            

                   </Table.Head>
                   {users.map((user) => (
                       <Table.Body className = 'divide-y'  key={user._id}>
                           <Table.Row key={user._id} className=' bg-white dark:border-gray-700 dark:bg-gray-800'>
                               <Table.Cell>
                                   {new Date(user.createdAt).toLocaleDateString()}
                               </Table.Cell>
                               <Table.Cell>
                              
                                   <img src={user.profilePhoto} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                 
                               </Table.Cell>
                               <Table.Cell>
                               <span className='font-medium text-gray-900 dark:text-white'
                                      >

                                   {user.username}

                               </span>
                               </Table.Cell>
                               <Table.Cell>
                                   {user.email}
                               </Table.Cell>
                               <Table.Cell>
                                      {user.isAdmin ? (<FaCheck className='text-green-500'/>) : (<FaTimes className='text-red-500'/>)}
                               </Table.Cell>
                               <Table.Cell>
                                   <Button
                                   onClick={() => { 
                                        setShowModal(true)
                                        setUserIdToDelete(user._id)
                                    }}
                                   color='failure'
                                   >Delete</Button>
                               </Table.Cell>

                           </Table.Row>
                       </Table.Body>
                   ))}

                </Table> 
                {showMore && (
                    <div className=''>
                        <Button
                        onClick={handleShowMore}
                        color='primary'
                        className='w-full text-teal-500 self-center text-sm py-7'
                        >Show More</Button>
                    </div>
                )}
            </>
        ):(
            <>
                <h1 className='text-2xl font-bold'>No Users Found</h1>
                <p className="text-lg">You have no users yet</p>
            </>
        )
        }
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
            <Modal.Header>
                {/* <h3 className='text-xl font-semibold'>Delete Account</h3> */}
            </Modal.Header>
            <Modal.Body>
            <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                <p>Are you sure you want to delete this user?</p>
                <p>This action cannot be undone.</p>
            </div>
            <div>
                <Button className='w-full mt-4' color = {'failure'} onClick={handleDeleteUser} >Delete User</Button>
                <Button className='w-full mt-4' outline onClick={() => setShowModal(false)}>Cancel</Button>
            </div>

            </Modal.Body>
            
        </Modal>
    </div>
  )
}

export default DashUser