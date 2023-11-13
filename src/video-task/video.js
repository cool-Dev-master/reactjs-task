import { useEffect, useRef, useState } from "react";
import "./video.css"

const VideoCapture = () => {
    const [videoStream, setVideoStream] = useState(null);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const videoRef = useRef(null);
    const previewRef = useRef(null);

    useEffect(() => {
        document.title = 'Video task';
        if (videoStream && videoRef.current) {
            videoRef.current.srcObject = videoStream;
        }
        if (recordedVideo && previewRef.current) {
            previewRef.current.src = recordedVideo;
        }
    }, [videoStream, recordedVideo]);

    const openCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
    }

    const handleStart = async () => {
        try {
            if (videoStream) {
                const captured = videoStream.getTracks();
                captured.forEach((vid) => vid.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            setIsRecording(true);
            const recorder = new MediaRecorder(stream);

            const chunks = [];
            recorder.start();
            recorder.ondataavailable = (event) => chunks.push(event.data);
            recorder.onstop = () => setRecordedVideo(URL.createObjectURL(new Blob(chunks, { type: "video/webm" })));

        } catch (err) {
            setIsRecording(false);
            handleError(err);
        }
    };

    const handleStop = () => {
        if (videoStream) {
            const captured = videoStream.getTracks();
            captured.forEach((vid) => vid.stop());
        }
        handleReset();
    };

    const handleStopPreview = () => {
        handleReset(true);
    };

    const handleError = (err) => {
        const errorMsg = err.name.toLowerCase().includes('notallowed') ? `${err.message} Can't access camera` : err.message;
        alert(errorMsg);
        handleReset();
        console.error(err);
    };

    const handleReset = (clearRecorded = false) => {
        setVideoStream(null);
        setIsRecording(false);
        if (clearRecorded) {
            setRecordedVideo(null);
        }
    };

    return (
        <div className="video-container">
            <h1>Record video</h1>
            <section>
                {videoStream ? (
                    <div className="video-player">
                        <video ref={videoRef} autoPlay muted controls />
                        {isRecording ?
                            <button onClick={handleStop} className="stop-record"></button> :
                            <div className="starting">
                                <button onClick={handleStart} className="start-record">Start recording</button>
                                <button onClick={handleStop} className="cancel-record">Cancel</button>
                            </div>}
                    </div>
                ) : recordedVideo ? (
                    <div className="video-player">
                        <video ref={previewRef} autoPlay muted controls loop/>
                        <button onClick={handleStopPreview} className="stop-preview">Stop preview</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={openCamera}>Open Camera</button>
                        <div className="info">
                            <strong>Info:</strong> Clicking on the above button will start recording video from your camera.
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default VideoCapture;
