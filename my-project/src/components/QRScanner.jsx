import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = ({ onScanSuccess }) => {
  const [scanResult, setScanResult] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);

  const handleScanSuccessInternal = (result) => {
    if (result) {
      const scannedData = result.text;
      setScanResult(scannedData);
      
      if (onScanSuccess) {
        onScanSuccess(scannedData);
      }
    }
  };

  const startCamera = async () => {
    if (!codeReader.current) {
      codeReader.current = new BrowserMultiFormatReader();
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      codeReader.current.decodeFromVideoDevice(null, videoRef.current, handleScanSuccessInternal)
        .then(() => {
          console.log('Camera started');
        })
        .catch(err => {
          console.error('Error starting camera:', err);
        });
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  useEffect(() => {
    if (scanning) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scanning]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      decodeQRCodeFromFile(file);
    }
  };

  const decodeQRCodeFromFile = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target.result;
        const browserReader = new BrowserMultiFormatReader();
        try {
          const image = await browserReader.decodeFromImage(undefined, result);
          setScanResult(image.text);
        } catch (decodeError) {
          console.error('Error decoding QR code from file', decodeError);
          setScanResult('Failed to decode QR code from image.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error reading file', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
  
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.pause();
      }
  
      streamRef.current = null;
    }
  
    if (codeReader.current) {
      codeReader.current.stopContinuousDecode();
      codeReader.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-gray-700 text-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">QR Code Scanner</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Upload QR Code Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
          />
          {imageFile && <p className="mt-2 text-sm">Image file selected: {imageFile.name}</p>}
          <p className="mt-2 text-sm">Result: {scanResult}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Scan QR Code with Camera</h2>
          <button
            onClick={() => setScanning(prev => !prev)}
            className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded"
          >
            {scanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
          {scanning && (
            <div className="relative w-full mt-4" style={{ height: '240px' }}>
              <video ref={videoRef} autoPlay className="rounded-lg w-full h-full object-cover" />
            </div>
          )}
          <p className="mt-2 text-sm">Result: {scanResult}</p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
