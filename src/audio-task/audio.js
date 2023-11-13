import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./audio.css";

const AudioCapture = () => {
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const createWaveform = () => {
      if (audioFile) {
        waveformRef.current = WaveSurfer.create({
          container: "#waveform",
          waveColor: 'blue',
          progressColor: 'red',
          cursorColor: 'transparent',
        });

        waveformRef.current.load(audioElement.src);
        waveformRef.current.on('audioprocess', () => {
          setCurrentTime(waveformRef.current.getCurrentTime());
        });
        waveformRef.current.on('finish', () => {
          handleStop();
        });
      }
    };

    const loadAudio = async () => {
      // const fileInput = document.querySelector('input[type="file"]');
      // const file = fileInput?.files[0];

      if (audioFile && audioElement) {
        const blobFile = URL.createObjectURL(audioFile)
        if (blobFile) {
          audioElement.src = blobFile;
          createWaveform();
        }
      }
    };

    loadAudio();

    return () => {
      if (waveformRef?.current)
        waveformRef.current.destroy();
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (waveformRef.current) {
      if (isPlaying) {
        waveformRef.current.pause();
      } else {
        waveformRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    console.log('stopping');
    if (waveformRef.current) {
      waveformRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleUpload = () => {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.click();
  };

  const handleFileChange = (e) => {
    const file = e.target?.files[0];
    setAudioFile(file);
  };

  const handleRemove = () => {
    handleStop();
    setAudioFile(null);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="audio-container">
      <h1>Record audio</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} style={{ display: 'none' }} />
      {audioFile ?
        <>
          <div id="waveform" className="waveform"></div>
          <div className="audio-details">
            <div className="play-pause-buttons">
              <div className={isPlaying ? "pause-button" : "play-button"} onClick={handlePlayPause}></div>
              {isPlaying &&
                <div className="stop-button" onClick={handleStop}></div>}
            </div>
            <div className="playing-time">Playing Time: <b>{formatTime(currentTime)}</b></div>
            <div className="delete-button" onClick={handleRemove}>Remove audio</div>
            <audio ref={audioRef} style={{ display: 'none' }} />
          </div>
        </> :
        <div className="upload-button" onClick={handleUpload}>Select audio file</div>}
    </div>
  );
};

export default AudioCapture;
