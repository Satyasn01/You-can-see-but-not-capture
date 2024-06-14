// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCellPhoneDetected, setIsCellPhoneDetected] = useState(false);

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      console.log(obj);

      const cellPhoneDetected = obj.some(prediction => prediction.class === "cell phone" || prediction.class === "remote");
      takeAction(cellPhoneDetected);

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  const takeAction = (detected) => {
    setIsCellPhoneDetected(detected);
    if (detected) {
      setTimeout(() => {
        setIsCellPhoneDetected(false);
      }, 10000); // Change this to the amount of time you want the block screen to stay
    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            opacity: 0, // Make the webcam feed invisible
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
            opacity: 0, // Make the canvas invisible
          }}
        />

<div style={{
  position: "absolute",
  top: "50%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  transform: "translateY(-50%)",
  zIndex: 10,
  color: "#FFFFFF",
  fontSize: "2em", // Increase the font size
  width: "100%",
  textAlign: "center",
  animation: "scroll 10s linear infinite",
}}>
  PAN: CNAT7372910,ADDHAR:3239239991
</div>

        {isCellPhoneDetected && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#FF6347",
            zIndex: 11,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <p style={{ color: "#FFFFFF", fontSize: "2em" }}>Cellphone Detected!</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
