/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';

const TimeStamp = ({ timestamp }) => {
  const [time, setTime] = useState('');

  const timeString = (ts) => {
    const timeDiff = new Date().getTime() - new Date(ts * 1000).getTime();

    const timeInSec = timeDiff / 1000;

    if (timeInSec < 60) {
      setTime(`${timeInSec.toFixed(0)} sec${timeInSec === 1 ? '' : 's'} ago`);
    } else if (timeInSec >= 60 && timeInSec < 3600) {
      setTime(`${(timeInSec / 60).toFixed(0)} min${timeInSec === 60 ? '' : 's'} ago`);
    } else if (timeInSec >= 3600 && timeInSec < 86400) {
      setTime(`${(timeInSec / 3600).toFixed(0)} hour${timeInSec === 3600 ? '' : 's'} ago`);
    } else {
      setTime(`${(timeInSec / 86400).toFixed(0)} day${timeInSec === 86400 ? '' : 's'} ago`);
    }
  };

  useEffect(() => {
    let interval;

    interval = setInterval(() => {
      timeString(timestamp);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [timestamp]);

  if (!timestamp) return <p className="post__time">Posted just now!</p>;

  return <p className="post__time">{time ? `Posted ${time}` : null}</p>;
};

export default TimeStamp;
