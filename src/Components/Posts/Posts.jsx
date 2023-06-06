import { useEffect, useState } from 'react';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import Post from '../Post/Post';
import { db } from '../../Database/firebase';

import './Posts.css';

const Posts = () => {
  //* Posts State
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const postsColRef = collection(db, 'posts');
    const postsQuery = query(postsColRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      let data = [];
      querySnapshot?.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPosts(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="posts">
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default Posts;
