import React from 'react'

const About = () => {
  return (
    <div className=' min-h-screen flex items-center justify-center'>
      <div className=' max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className=' text-3xl font-semibold text-center my-7'>About Bhallu's Blog</h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Bhallu's Blog is a platform where you can read and write about your favorite topics. You can share your thoughts and ideas with the world. You can also read articles written by other users and give feedback on them. Bhallu's Blog is a place where you can express yourself freely and connect with like-minded people.
            </p>
            <p>
              Bhallu's Blog was created with the goal of providing a platform for people to share their thoughts and ideas with the world. We believe that everyone has a story to tell and that everyone's voice deserves to be heard. We want to create a community where people can come together to share their experiences, learn from each other, and grow together.
            </p>
            <p>
              We hope that you enjoy using Bhallu's Blog and that you find it to be a valuable resource for sharing your thoughts and ideas. If you have any questions or feedback, please feel free to contact us. We would love to hear from you!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About