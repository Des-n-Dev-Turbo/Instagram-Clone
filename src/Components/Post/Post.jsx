/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Avatar } from '@mui/material';

import { UserContext } from '../../Context/UserProvider';
import Comments from '../Comments/Comments';
import AddComments from '../AddComments/AddComments';

import './Post.css';
import TimeStamp from '../TimeStamp/TimeStamp';

const Post = ({ id, username, caption, imageUrl, timestamp }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src="/static/images/avatar1.jpg" />
        <h3>{username}</h3>
      </div>
      <img src={imageUrl} alt="Post Image" className="post__image" />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      <TimeStamp timestamp={timestamp?.seconds || null} />
      <Comments postId={id} />
      {user && <AddComments postId={id} />}
    </div>
  );
};

export default Post;
