import { useState } from 'react';
import './App.css';
import AudioCapture from './audio-task/audio';
import VideoCapture from './video-task/video';

function App() {
  const [isFirst, setIsFirst] = useState(true);

  return (
    <div className="App">
      <h2>Assignment tasks for Idzigns</h2>
      <div className='tab-container'>
        <div className='tabs' onClick={() => setIsFirst(true)}>Task - 1: Video <input type="radio" checked={isFirst} readOnly /></div>
        <div className='tabs' onClick={() => setIsFirst(false)}>Task -2 : Audio <input type="radio" checked={!isFirst} readOnly /></div>
      </div>
      {isFirst ?
        <VideoCapture /> :
        <AudioCapture />}
      <footer>Created by © Sathya Pandian</footer>
    </div>
  );
}

export default App;
