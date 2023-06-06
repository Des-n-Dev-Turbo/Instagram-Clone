/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

import { db } from '../../Database/firebase';
import TimeStamp from '../TimeStamp/TimeStamp';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      const commentsColRef = collection(db, 'posts', postId, 'comments');

      unsubscribe = onSnapshot(commentsColRef, (querySnapshot) => {
        let data = [];
        querySnapshot?.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        setComments(data);
      });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post__comments">
      {comments?.map((comment) => (
        <p key={comment.id} className='post__comment'>
          <span>
            <strong>{comment.user}</strong> {comment.text}
          </span>
          <span className='post__comment--time'>
            <TimeStamp timestamp={comment.timestamp.seconds} />
          </span>
        </p>
      ))}
    </div>
  );
};

export default Comments;
