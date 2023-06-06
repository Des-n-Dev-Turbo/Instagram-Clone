/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import { Button, Input } from '@mui/material';

import { UserContext } from '../../Context/UserProvider';

import './AddComments.css';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Database/firebase';

const AddComments = ({ postId }) => {
  const [comment, setComment] = useState('');
  const { user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    addDoc(collection(db, 'posts', postId, 'comments'), {
      text: comment,
      user: user.displayName,
      timestamp: serverTimestamp(),
    });

    setComment('');
  };

  return (
    <form className="comment-box">
      <Input
        className="comment-box__input"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <Button
        className="comment-box__button"
        type="submit"
        disabled={!comment || comment.trim().length === 0}
        onClick={handleSubmit}
      >
        Post
      </Button>
    </form>
  );
};

export default AddComments;
