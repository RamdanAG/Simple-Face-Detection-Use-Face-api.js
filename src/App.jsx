import { useEffect, useRef, useState } from 'react';
import * as faceapi from "face-api.js";
import './App.css'; 

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const imgRef = useRef();
  const canvasRef = useRef();

  const handleImage = async () => {
    if (imgRef.current) {

      const detections = await faceapi.detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const canvas = canvasRef.current;


      faceapi.matchDimensions(canvas, { width: imgRef.current.width, height: imgRef.current.height });


      const resizedDetections = faceapi.resizeResults(detections, { width: imgRef.current.width, height: imgRef.current.height });


      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);


      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models')
      ])
      .then(handleImage)
      .catch((e) => console.log(e));
    };


    imgRef.current && loadModels();
  }, [selectedImage]);

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <>
      <div className="bg-image"></div>
      <div>
        <div className="app relative z-10">
          <header>
            <h1 className="text-white">Simple Face Detection Use <span>Face-api.js</span></h1>
            <p className="text-white">Upload an image to detect faces, landmarks, and expressions.</p>
            <p className="Noted">(Note: Images will not be uploaded to the website, and only run on the client side)</p>
          </header>
  
          <div className="input-section">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              id="fileInput" 
              className="file-input" 
            />
            <label htmlFor="fileInput" className="file-label">✨Choose a File </label>
          </div>
  
          <div className="image-section">
            {selectedImage && (
              <div className="canvas-section">
                <img ref={imgRef} src={selectedImage} alt="Uploaded" width="500" height="500" />
                <canvas ref={canvasRef} width="500" height="500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
