/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';

import { Box, Button, Input, LinearProgress, Typography } from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { db, storage } from '../../Database/firebase';

import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState('');

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const fileRef = useRef();

  const handleUpload = () => {
    const storageRef = ref(storage, `/images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(uploadProgress);
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(collection(db, 'posts'), {
            timestamp: serverTimestamp(),
            caption,
            imageUrl: url,
            username,
          }).then(() => {
            setProgress(0);
            setCaption('');
            setImage(null);
            fileRef.current.value = '';
          });
        });
      }
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="image-upload">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={progress === 0 ? 0 : progress + 2}
          sx={{ width: '100%' }}
        />
        <Typography variant="body2" color="text.secondary">
          {progress}%
        </Typography>
      </Box>
      <Input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Input type="file" onChange={handleFileChange} ref={fileRef} sx={{ marginBottom: '10px' }} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
