import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { set } from "mongoose";

const CommentSection = (postId) => {
  const { currentuser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();
  // console.log(comments);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(postId.postId);
    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        setComment("");
        setError(null);
        setComments([data, ...comments]);
      } else {
        setError(data.message);
        // console.log(data.message);
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/comment/getPostComments/${postId.postId}`
        );
        const data = await response.json();
        if (response.ok) {
          setComments(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        // setError(error.message);
        console.log(error.message);
      }
    };
    fetchComments();
  }, [postId.postId]);
  const handleLike = async (commentId) => {
    try {
      if (!currentuser) {
        return navigate("/sign-in");
        // return setError('Please sign in to like comments');
      }
      const response = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (response.ok) {
        const data = await response.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.numberOfLikes,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEdit = async (comment, newComment) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              content: newComment,
            }
          : c
      )
    );
  };
  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
        if(!currentuser){
            return navigate('/sign-in')
        }
      const response = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentuser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentuser.profilePic}
            alt={currentuser.username}
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-blue-500 hover:underline"
          >
            @{currentuser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          <p>Sign in to comment</p>
          <Link to="/sign-in" className=" text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}
      {currentuser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <Button
              className="mt-3"
              gradientDuoTone="purpleToBlue"
              outline
              type="submit"
            >
              Post Comment
            </Button>
          </div>
          {error && (
            <Alert className="mt-3" color="failure">
              {error}
            </Alert>
          )}
        </form>
      )}
      {comments.length > 0 ? (
        <>
          <div className=" text-sm my-5 flex items-center gap-1">
            <p>{comments.length === 1 ? "Comment" : "Comments"}</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length} </p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      ) : (
        <div className="text-gray-500 text-sm my-5">No comments yet</div>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
            <Modal.Header>
                {/* <h3 className='text-xl font-semibold'>Delete Account</h3> */}
            </Modal.Header>
            <Modal.Body>
            <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                <p>Are you sure you want to delete this comment?</p>
                <p>This action cannot be undone.</p>
            </div>
            <div>
                <Button className='w-full mt-4' color = {'failure'} onClick={()=>{handleDelete(commentToDelete)}} >Delete </Button>
                <Button className='w-full mt-4' outline onClick={() => setShowModal(false)}>Cancel</Button>
            </div>

            </Modal.Body>
            
        </Modal>
    </div>
  );
};

export default CommentSection;
