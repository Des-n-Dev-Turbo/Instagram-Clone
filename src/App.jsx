import { useContext, useEffect, useState } from 'react';

import { Box, Button, Input, Modal } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import Posts from './Components/Posts/Posts';
import ImageUpload from './Components/ImageUpload/ImageUpload';
import { auth } from './Database/firebase';

import './App.css';
import { UserContext } from './Context/UserProvider';

function App() {
  //* Modal State
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);

  //* Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //* User State

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log({ authUser });
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setUser]);

  useEffect(() => {}, []);

  const handleSigning = (e) => {
    e.preventDefault();

    if (openSignIn) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(`Logged In - ${userCredential.user.uid}`);
          setOpen(false);
          setOpenSignIn(false);
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          return updateProfile(userCredential.user, {
            displayName: username,
          }).then(() => {
            setOpen(false);
          });
        })
        .catch((err) => {
          alert(err.message);
        });
    }

    setEmail('');
    setPassword('');
    setUsername('');
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setOpenSignIn(false);
        }}
      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img src="/Instagram.png" alt="Instagram Logo" className="app__header-image" />
            </center>
            {openSignIn ? null : (
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleSigning}>{openSignIn ? 'Sign In' : 'Sign Up'}</Button>
          </form>
        </Box>
      </Modal>
      <div className="app__header">
        <img src="/Instagram.png" alt="Instagram Logo" className="app__header-image" />
        <div>
          {user ? (
            <Button onClick={() => signOut(auth)}>Sign Out</Button>
          ) : (
            <div className="app__login-container">
              <Button
                onClick={() => {
                  setOpen(true);
                  setOpenSignIn(true);
                }}
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  setOpen(true);
                  setOpenSignIn(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      <Posts />
      <div className="app__uploader">
        {user ? user.displayName && <ImageUpload username={user?.displayName} /> : <h3>Sorry! Login to Upload...</h3>}
      </div>
    </div>
  );
}

export default App;
