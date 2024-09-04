/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsTaxiFront, BsCreditCard2Front, BsFillPersonVcardFill, BsQuestionSquare } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsEyeFill } from "react-icons/bs";
import QRScanner from '../components/QRScanner.jsx';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function AdminParkingSlot() {
  const [error, setError] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('student');
  const [selectedVehicle, setSelectedVehicle] = useState('motorcycle');
  const [licenseSrc, setLicenseSrc] = useState(null);
  const [orcrSrc, setOrcrSrc] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(null);
  const streamRef = useRef(null);
  const [reader, setReader] = useState(null);
  const [occupiedSpots, setOccupiedSpots] = useState({
    motorcycle: [],
    tricycle: [],
    fourwheeler: []
  });
  const [categories, setCategories] = useState({
    motorcycle: { count: 300, color: 'bg-green-500' },
    tricycle: { count: 20, color: 'bg-green-500' },
    fourwheeler: { count: 25, color: 'bg-green-500' }
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleOpenModal = (src) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };

  const handleCloseModal =() => {
    setIsModalOpen(false);
    setModalImageSrc('');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost/website/my-project/Backend/logout.php', {
        withCredentials: true,
      });

      if (response.data.success) {
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Error logging out: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      try {
        const url = selectedUserType === 'faculty'
          ? 'http://localhost/website/my-project/Backend/facultyfetchoccupiedslot.php'
          : 'http://localhost/website/my-project/Backend/fetchoccupiedslot.php';

        const response = await axios.get(url, {
          withCredentials: true
        });

        if (response.data.status === 'success') {
          setOccupiedSpots(response.data.data || {
            motorcycle: [],
            tricycle: [],
            fourwheeler: []
          });
        } else {
          setError(response.data.message || 'Error fetching occupied slots.');
        }
      } catch (error) {
        setError('Error fetching occupied slots: ' + error.message);
      }
    };

    fetchOccupiedSlots();
  }, [selectedUserType]);
  
  const handleSpotSelection = async (spotNumber) => {
    const spotNumberStr = spotNumber.toString();
    const isOccupied = occupiedSpots[selectedVehicle]?.includes(spotNumberStr);
  
    if (!isOccupied) {
      alert('This parking spot is available.');
    } else {
      try {
        const fetchUrl = selectedUserType === 'faculty'
          ? 'http://localhost/website/my-project/Backend/fetchfacultydata.php'
          : 'http://localhost/website/my-project/Backend/fetchstudentsdata.php';
    
        const response = await axios.get(fetchUrl, { withCredentials: true });
    
        if (response.data.success) {
          const data = selectedUserType === 'faculty' ? response.data.faculty : response.data.students;
          const userData = data.find(user => user.slot_number === spotNumberStr);
    
          if (userData) {
            setPopupData(userData);
            setLicenseSrc(userData.License ? `data:image/jpeg;base64,${userData.License}` : null);
            setOrcrSrc(userData.ORCR ? `data:image/jpeg;base64,${userData.ORCR}` : null);
          } else {
            alert('No user data found for this slot.');
          }
        } else {
          alert('Failed to retrieve user data.');
        }
      } catch (error) {
        alert('Error fetching user data: ' + error.message);
      }
    }
  };
  
  const renderSpots = (count, color, vehicleType) => {
    const occupied = occupiedSpots[vehicleType] || [];
  
    return Array.from({ length: count }, (_, index) => {
      const spotNumber = index + 1;
      const isOccupied = occupied.map(Number).includes(spotNumber);
      const isSelected = selectedSpot === spotNumber && selectedVehicle === vehicleType;
  
      let spotColorClass = '';
      if (isSelected) {
        spotColorClass = 'bg-red-400';
      } else if (isOccupied) {
        spotColorClass = 'bg-red-600 cursor-not-allowed';
      } else {
        spotColorClass = color;
      }
  
      return (
        <div
          key={index}
          id={`slot-${spotNumber}`}
          className={`rounded-xl h-20 flex items-center justify-center cursor-pointer ${spotColorClass}`}
          onClick={() => handleSpotSelection(spotNumber)}
        >
          {spotNumber}
        </div>
      );
    });
  };
  

  const handleEdit = () => {
    alert('Edit functionality not implemented yet.');
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`http://localhost/website/my-project/Backend/delete.php`, { id: popupData.id }, {
        withCredentials: true
      });
      if (response.data.success) {
        alert('User deleted successfully.');
        setPopupData(null);
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const updateTime = async (userType, id, timeIn, timeOut) => {
    try {
        const response = await fetch('http://localhost/website/my-project/Backend/settime.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: new URLSearchParams({
                user_type: userType,
                id: id,
                time_in: timeIn || '',
                time_out: timeOut || ''
            }),
        });

        const result = await response.json();
        if (result.status === 'success') {
            console.log(result.message);
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

const formatAMPM = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
  const ampm = hours >= 12 ? 'AM' : 'PM';
  const hours12 = hours % 12 || 12;
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
  return `${hours12}:${minutesFormatted} ${ampm}`;
};

// Function to handle Time In for both students and faculty
const handleTimeIn = async () => {
  const userId = popupData.id;
  const userType = selectedUserType;
  if (!userId) {
      console.error('User ID is missing');
      return;
  }
  const timeIn = formatAMPM(new Date().toTimeString().substring(0, 5)); // Get current time in "HH:mm" format
  await updateTime(userType, userId, timeIn, ''); // Pass the formatted time
  alert('Time In recorded successfully!');
};

// Function to handle Time Out for both students and faculty
const handleTimeOut = async () => {
  const userId = popupData.id;
  const userType = selectedUserType;
  if (!userId) {
      console.error('User ID is missing');
      return;
  }
  const timeOut = formatAMPM(new Date().toTimeString().substring(0, 5)); // Get current time in "HH:mm" format
  await updateTime(userType, userId, '', timeOut); // Pass the formatted time
  alert('Time Out recorded successfully!');
};

// Function to handle QR code scan success
const onScanSuccess = async (slotType, slotNumber) => {
  try {
    setSelectedVehicle(slotType);
    setSelectedSpot(parseInt(slotNumber, 10));

    const fetchUrl = selectedUserType === 'faculty'
      ? 'http://localhost/website/my-project/Backend/fetchfacultydata.php'
      : 'http://localhost/website/my-project/Backend/fetchstudentsdata.php';

    const response = await axios.get(fetchUrl, { withCredentials: true });
    console.log('Response:', response.data);
    
    if (response.data.success) {
      const data = selectedUserType === 'faculty' ? response.data.faculty : response.data.students;
      console.log('Fetched user data:', data);
      
      const userData = data.find(user => user.slot_number === slotNumber);

      if (userData) {
        setPopupData(userData);
        setLicenseSrc(userData.License ? `data:image/jpeg;base64,${userData.License}` : null);
        setOrcrSrc(userData.ORCR ? `data:image/jpeg;base64,${userData.ORCR}` : null);
      } else {
        alert('No user data found for this slot.');
      }
    } else {
      alert('Failed to retrieve user data.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    alert('Error fetching user data: ' + error.message);
  }
};


// Function to handle QR code scan and parse the data
const handleQRCodeScan = (qrCodeData) => {
  const { slot_type, slot_number } = qrCodeData;

  if (slot_type && slot_number) {
    onScanSuccess(slot_type, slot_number);
  } else {
    console.error('Invalid QR code data');
  }
};

// Handle internal QR code scan result
// Handle internal QR code scan result
const handleScanSuccessInternal = (result) => {
  if (result && result.text) {
    const scannedData = result.text.trim();
    const [slotType, slotNumber] = scannedData.split(':');

    if (slotType && slotNumber) {
      handleQRCodeScan({ slot_type: slotType.trim(), slot_number: slotNumber.trim() });
      setScanning(false);
      reader.stop(); // Stop scanning after a successful scan
    } else {
      console.error('Slot type or slot number is missing in the scanned data.');
    }
  } else {
    console.error('Result is null or undefined or does not contain text');
  }
};

// Start and stop camera based on scanning state
useEffect(() => {
  if (scanning) {
    startCamera();
  } else {
    stopCamera();
  }
  return () => stopCamera();
}, [scanning]);


// Initialize and start the camera for QR code scanning
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

// Stop the camera when not scanning
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

// Start and stop camera based on scanning state
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
        try {
          const image = await new BrowserMultiFormatReader().decodeFromImage(undefined, result);
          handleScanSuccessInternal({ text: image.text }); // Pass result.text to the handler
        } catch (decodeError) {
          console.error('Error decoding QR code from file:', decodeError);
          setScanResult('Failed to decode QR code from image.');
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setScanResult('Failed to read file.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Unexpected error:', err);
      setScanResult('Unexpected error occurred.');
    }
  };



  return (
    <div className="relative w-full h-screen bg-blue-900 flex">
      {/* Navigation */}
      <button
        className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
        onClick={toggleNav}
      >
        {isNavOpen ? '✕' : '☰'}
      </button>

      {/* Navigation menu */}
      <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto ${isNavOpen ? 'block w-full' : 'hidden'}`}>
        <div className="border-b-2 border-blue-900 w-full h-24 text-blue-900 flex flex-col items-center justify-center mt-10 text-xl tracking-wider">
          <h1 className="text-bold text-4xl tracking-widest">PARKING SYSTEM</h1>
        </div>
        <div className="flex flex-col justify-evenly w-full h-2/4 relative">
            <Link to="/admindashboard" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/adminparkingslot" className="group no-underline h-16 flex items-center pl-8 bg-blue-900 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/adminreport" className="group no-underline w-full h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/adminaccount" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsQuestionSquare /> <span className="ml-5">Account</span>
              </li>
            </Link>
        </div>
        <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600" onClick={handleLogout}>
          <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180"/>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className="w-full h-screen bg-blue-900">
        <div className="w-full h-20 flex justify-end items-end border-b-2">
          <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Parking Slots</p>
        </div>
        <div  className="w-full h-full flex flex-col">
          <div onScanSuccess={handleQRCodeScan} className="mt-10 flex flex-col items-center justify-center">
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
                  <p className="mt-2 text-sm"> {scanResult}</p>
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
                  <p className="mt-2 text-sm">{scanResult}</p>
                </div>
              </div>
            </div>
            <div className="w-full h-screen bg-blue-900">
              <div className="container bg-blue-900 mx-auto p-4 h-4/5 overflow-auto mt-10 border-2 rounded">
                <div className="mb-4">
                  <label className="mr-4 text-white">Select User Type:</label>
                  <select
                    value={selectedUserType}
                    onChange={(e) => setSelectedUserType(e.target.value)}
                    className="p-2 w-40 rounded bg-blue-200 text-blue-900 font-semibold"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="mr-4 text-white">Select Vehicle Type:</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="p-2 rounded bg-blue-200 text-blue-900 font-semibold"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="tricycle">Tricycle</option>
                    <option value="fourwheeler">Four Wheeler</option>
                  </select>
                </div>
                <div className="grid grid-cols-10 gap-4 text-white">
                  {renderSpots(categories[selectedVehicle].count, categories[selectedVehicle].color, selectedVehicle)}
                </div>
                </div>
              <div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up for showing user data */}
      {popupData && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-2/4">
            <h2 className="text-2xl font-semibold mb-4">Slot User Information</h2>
            <div>
              {selectedUserType === 'student' ? (
                <div>
                  <p><strong>Student ID:</strong> {popupData.id || 'N/A'}</p>
                  <p><strong>Student Number:</strong> {popupData['Student Number'] || 'N/A'}</p>
                  <p><strong>Name:</strong> {popupData.Name || 'N/A'}</p>
                  <p><strong>Email:</strong> {popupData.Email || 'N/A'}</p>
                  <p><strong>Vehicle:</strong> {popupData.Vehicle || 'N/A'}</p>
                  <p><strong>Plate Number:</strong> {popupData['Plate Number'] || 'N/A'}</p>
                  <p><strong>Slot Number:</strong> {popupData.slot_number || 'N/A'}</p>
                  <p><strong>Time In:</strong> {popupData['Time In'] ? formatAMPM(popupData['Time In']) : 'N/A'}</p>
                  <p><strong>Time Out:</strong> {popupData['Time Out'] ? formatAMPM(popupData['Time Out']) : 'N/A'}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Name:</strong> {popupData.Name || 'N/A'}</p>
                  <p><strong>Email:</strong> {popupData.Email || 'N/A'}</p>
                  <p><strong>Position:</strong> {popupData.Position || 'N/A'}</p>
                  <p><strong>Building:</strong> {popupData.Building || 'N/A'}</p>
                  <p><strong>Vehicle:</strong> {popupData.Vehicle || 'N/A'}</p>
                  <p><strong>Plate Number:</strong> {popupData['Plate Number'] || 'N/A'}</p>
                  <p><strong>Slot Number:</strong> {popupData.slot_number || 'N/A'}</p>
                  <p><strong>Time In:</strong> {popupData['Time In'] ? formatAMPM(popupData['Time In']) : 'N/A'}</p>
                  <p><strong>Time Out:</strong> {popupData['Time Out'] ? formatAMPM(popupData['Time Out']) : 'N/A'}</p>
                </div>
              )}

              <div className="w-full flex justify-around mt-4">
                {licenseSrc ? (
                  <div className="flex flex-col">
                    <p>License</p>
                    <div className="flex">
                      <img src={licenseSrc} alt="License" className="w-40 h-32 inline-block max-sm:w-24" />
                      <button
                        onClick={() => handleOpenModal(licenseSrc)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        aria-label="View License"
                      >
                        <BsEyeFill className="w-10 h-7"/>
                      </button>
                    </div>
                  </div>
                ) : <p>No License image available</p>}
                {orcrSrc ? (
                  <div className="flex flex-col">
                    <p>ORCR</p>
                    <div className="flex">
                      <img src={orcrSrc} alt="ORCR" className="w-40 h-32 inline-block max-sm:w-24" />
                      <button
                        onClick={() => handleOpenModal(orcrSrc)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        aria-label="View ORCR"
                      >
                        <BsEyeFill className="w-10 h-7"/>
                      </button>
                    </div>
                  </div>
                ) : <p>No image available</p>}
              </div>

              {/* Buttons for Time in and Time out */}
              <div className="w-full flex items-center justify-evenly mt-20">
                <button
                  className="p-4 w-48 bg-green-500 text-white text-xl rounded hover:bg-green-700"
                  onClick={handleTimeIn}
                >
                  Time In
                </button>
                <button
                  className="p-4 w-48 bg-red-500 text-white text-xl rounded hover:bg-red-700"
                  onClick={handleTimeOut}
                >
                  Time Out
                </button>
              </div>
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white p-4 rounded-lg shadow-lg flex justify-center w-3/4 h-3/4 max-sm:h-1/3 max-sm:w-full">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
                      aria-label="Close Modal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <img src={modalImageSrc} alt="Enlarged" className="max-w-full max-h-full max-sm:w-full" />
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex justify-between mt-4">
              <button
                className="mt-4 w-1/4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="mt-4 w-1/4 p-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="mt-4 w-1/4 p-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                onClick={() => setPopupData(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}