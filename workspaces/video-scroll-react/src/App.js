import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const videoElement = useRef();
  const [progress, setProgress] = useState(0);

  const scrollHandler = useCallback(() => {
    if (isNaN(videoElement.current.duration)) return;
    setProgress(window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
    if (progress < 0) setProgress(0);
    if (progress > 1) setProgress(1);

    console.log(
      videoElement.current.currentTime,
      videoElement.current.duration,
      progress
    );

    videoElement.current.currentTime = videoElement.current.duration * progress;
  }, [progress]);

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [scrollHandler]);

  return (
    <div className="App">
      <video ref={videoElement} className="sample-video" src="sample.mp4" muted></video>
    </div>
  );
}

export default App;
