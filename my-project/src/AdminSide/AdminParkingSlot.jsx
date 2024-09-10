/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsTaxiFront, BsCreditCard2Front, BsFillPersonVcardFill, BsQuestionSquare } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsEyeFill } from "react-icons/bs";
import { BsExclamationTriangle, BsPersonFillGear } from "react-icons/bs";
import QRScanner from '../components/QRScanner.jsx';
import { BrowserMultiFormatReader } from '@zxing/library';
import Beep from '../Pictures/beep.png';
import { MdTimerOff, MdTimer, MdDeleteForever, MdOutlineFileDownload  } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import GSO from '../Pictures/gsoo.png';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [occupiedSpots, setOccupiedSpots] = useState({
    motorcycle: [],
    tricycle: [],
    fourwheeler: []
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);


  const closePopup = () => {
    setPopupVisible(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const [formData, setFormData] = useState({
    studentNumber: '',
    fullname: '',
    email: '',
    position: '',
    building: '',
    yearsection: '',
    plateNumber: '',
    course: '',
    password: '',
    license: null,
    orcr: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
  
    // Add ID to the form data
    form.append('id', popupData.id);
  
    // Determine the URL based on the type (student or faculty/staff)
    const url = type === 'student'
      ? 'https://seagreen-wallaby-986472.hostingersite.com/admineditstudent.php'
      : 'https://seagreen-wallaby-986472.hostingersite.com/admineditfaculty.php';
  
    console.log('Form data being sent:', form);
  
    try {
      const response = await axios.post(url, form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response data:', response.data);
  
      if (response.data.success) {
        setPopupData((prev) => ({
          ...prev,
          ...formData,
          password: '', // Don't show the password in user data
        }));
        alert('Account updated successfully');
        setIsEditModalOpen(false);
        setPopupData(false);
      } else {
        alert('Error updating account: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Error updating account. Please try again.');
    }
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
      const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/logout.php', {
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
          ? 'https://seagreen-wallaby-986472.hostingersite.com/facultyfetchoccupiedslot.php'
          : 'https://seagreen-wallaby-986472.hostingersite.com/fetchoccupiedslot.php';

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
          ? 'https://seagreen-wallaby-986472.hostingersite.com/fetchfacultydata.php'
          : 'https://seagreen-wallaby-986472.hostingersite.com/fetchstudentsdata.php';
    
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

  const categories = selectedUserType === 'student' ? {
    motorcycle: { count: 500, color: 'bg-green-500' },
    tricycle: { count: 40, color: 'bg-green-500' },
    fourwheeler: { count: 40, color: 'bg-green-500' }
  } : {
    motorcycle: { count: 110, color: 'bg-yellow-400' },
    tricycle: { count: 0, color: 'bg-orange-500' },
    fourwheeler: { count: 25, color: 'bg-yellow-400' }
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

  const handleDelete = async (userType) => {

    const isConfirmed = window.confirm('Are you sure you want to delete this user?');

    if (!isConfirmed) {
      return;
    }
    try {
      // Log the data being sent
      console.log('Sending request with:', { id: popupData.id });
      
      // Send POST request
      const response = await axios.post('https://seagreen-wallaby-986472.hostingersite.com/delete.php', 
        { 
          id: popupData.id,
          userType: userType // Include userType to help PHP determine which table to use
        }, 
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' } // Ensure the content type is correct
        }
      );
  
      // Handle the response
      console.log('Response data:', response.data);
      if (response.data.success) {
        alert('User deleted successfully.');
        setPopupData(null);
      } else {
        alert('Failed to delete user: ' + response.data.message);
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };
  

  const updateTime = async (userType, id, timeIn, timeOut) => {
    try {
        const response = await fetch('https://seagreen-wallaby-986472.hostingersite.com/settime.php', {
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

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://seagreen-wallaby-986472.hostingersite.com/Logs.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await response.json();
      if (result.success) {
        setLogs(result.logs); // Store logs in state
        setPopupVisible(true); // Show popup after logs are fetched
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };


  const formatAMPM = (timeStr) => {
    if (timeStr === '00:00:00' || !timeStr) return '--:--:--'; // Return 'NA' if timeStr is null or undefined
  
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    if (isNaN(hours) || isNaN(minutes)) return 'NA'; // Return 'NA' if timeStr is invalid
  
    const ampm = hours >= 12 ? 'AM' : 'PM';
    const hours12 = hours % 12 || 12;
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
    return `${hours12}:${minutesFormatted} ${ampm}`;
  };
  

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'NA'; // Handle undefined or null timestamp

  const date = new Date(timestamp);

  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Extract date components
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;

  // Format date and time
  return `${month} ${day}, ${year} ${hours12}:${minutesFormatted} ${ampm}`;
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

const handleCloseModalQR = () => {
  setScanning(false);
};

// Function to handle QR code scan success
const onScanSuccess = async (slotType, slotNumber) => {
  try {
    setSelectedVehicle(slotType);
    setSelectedSpot(parseInt(slotNumber, 10));

    const fetchUrl = selectedUserType === 'faculty'
      ? 'https://seagreen-wallaby-986472.hostingersite.com/fetchfacultydata.php'
      : 'https://seagreen-wallaby-986472.hostingersite.com/fetchstudentsdata.php';

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

const handleScanSuccessInternal = (result) => {
  if (result && result.text) {
    const scannedData = result.text.trim();
    const [slotType, slotNumber] = scannedData.split(':');

    if (slotType && slotNumber) {
      handleQRCodeScan({ slot_type: slotType.trim(), slot_number: slotNumber.trim() });
      setScanning(false);
      stopCamera(); // Stop scanning after a successful scan
    } else {
      console.error('Slot type or slot number is missing in the scanned data.');
    }
  } else {
    console.error('Result is null or undefined or does not contain text');
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
    videoRef.current.play(); // Ensure video element starts playing

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

  const downloadLogsAsPDF = async () => {
    try {
      // Fetch logs from your server
      const response = await fetch('https://seagreen-wallaby-986472.hostingersite.com/logs.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await response.json();
  
      if (result.success) {
        const logs = result.logs;
  
        // Create a new jsPDF instance
        const doc = new jsPDF();
  
        // Add title to the PDF
        doc.setFontSize(15);
        doc.text('Logs Report', 14, 20);
  
        // Define table columns and data
        const columns = [
          { header: 'User Type', dataKey: 'user_type' },
          { header: 'User ID', dataKey: 'user_id' },
          { header: 'Student Number', dataKey: 'Student Number' },
          { header: 'Name', dataKey: 'Name' },
          { header: 'Position', dataKey: 'Position' },
          { header: 'Time In', dataKey: 'Time In' },
          { header: 'Time Out', dataKey: 'Time Out' },
          { header: 'Created At', dataKey: 'created_at' },
        ];

        const formattedLogs = logs.map(log => ({
          ...log,
          'Time In' : formatAMPM(log['Time In']),
          'Time Out' : formatAMPM(log['Time Out']),
          'created_at' : formatDateTime(log['created_at']),
        }));
  
        // Add table to PDF
        doc.autoTable({
          head: [columns.map(col => col.header)],
          body: formattedLogs.map(log => columns.map(col => log[col.dataKey || '--:--:--'])),
          startY: 30,
        });
  
        // Save the PDF
        doc.save('Logs_Report.pdf');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const sortLogs = (logs) => {
    return logs.sort((a, b) => {
      // Default sorting by created_at if no search term
      if (!searchTerm) {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      // Sorting logic based on search term and user type
      if (searchTerm) {
        // Compare based on search term and fields
        const term = searchTerm.toLowerCase();
        const aMatches = 
          a.Name.toLowerCase().includes(term) ||
          a.Email.toLowerCase().includes(term) ||
          a['Student Number']?.toLowerCase().includes(term) ||
          a.user_type?.toLowerCase().includes(term) ||
          new Date(a['Time In']).toLocaleTimeString().toLowerCase().includes(term) ||
          new Date(a.created_at).toLocaleDateString().toLowerCase().includes(term);

        const bMatches = 
          b.Name.toLowerCase().includes(term) ||
          b.Email.toLowerCase().includes(term) ||
          b['Student Number']?.toLowerCase().includes(term) ||
          b.user_type?.toLowerCase().includes(term) ||
          new Date(b['Time In']).toLocaleTimeString().toLowerCase().includes(term) ||
          new Date(b.created_at).toLocaleDateString().toLowerCase().includes(term);

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }

      return 0; // No sorting if neither a nor b matches the term
    });
  };

  // Filter logs by user type and then sort
  const filteredLogs = (logs) => {
    return logs.filter(log => {
      const term = searchTerm.toLowerCase();
  
      // Ensure that all properties are defined before using them
      const nameMatch = log.Name ? log.Name.toLowerCase().includes(term) : false;
      const positionMatch = log.Position ? log.Position.toLowerCase().includes(term) : false;
      const studentNumberMatch = log['Student Number'] ? log['Student Number'].toLowerCase().includes(term) : false;
      const userTypeMatch = log.user_type ? log.user_type.toLowerCase().includes(term) : false;
  
      // Debugging logs for date formatting
      console.log('Time In:', log['Time In'], 'Formatted Time In:', new Date(log['Time In']).toLocaleTimeString());
      const timeInMatch = log['Time In'] ? new Date(log['Time In']).toLocaleTimeString().toLowerCase().includes(term) : false;
  
      console.log('Created At:', log.created_at, 'Formatted Created At:', new Date(log.created_at).toLocaleDateString());
      const createdAtMatch = log.created_at ? new Date(log.created_at).toLocaleDateString().toLowerCase().includes(term) : false;
  
      console.log('Time Stamp:', log['Time Stamp'], 'Formatted Time Stamp:', formatDateTime(log['Time Stamp']));
      const timeStampMatch = log['Time Stamp'] ? formatDateTime(log['Time Stamp']).toLowerCase().includes(term) : false;
  
      return nameMatch || positionMatch || studentNumberMatch || userTypeMatch || timeInMatch || createdAtMatch || timeStampMatch;
    });
  };
  
  
  
  

  const [popupVisible, setIsPopupVisible] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('');

  const handleDeleteLogs = async (selection) => {
    const isConfirmed = window.confirm('Are you sure you want to delete these logs?');

    if (!isConfirmed) {
      return;
    }
    try {
      // Log the data being sent
      console.log('Sending request with:', { selection });

      // Send POST request
      const response = await axios.post('https://seagreen-wallaby-986472.hostingersite.com/logsdelete.php',
        { 
          selection // Include the selection criteria
        },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' } // Ensure the content type is correct
        }
      );

      // Handle the response
      console.log('Response data:', response.data);
      if (response.data.success) {
        alert('Logs deleted successfully.');
        setIsPopupVisible(false); // Hide popup on success
      } else {
        alert('Failed to delete logs: ' + response.data.message);
      }
    } catch (error) {
      alert('Error deleting logs: ' + error.message);
    }
  };


  return (
    <div className="relative w-full h-screen bg-blue-700 flex">
      {/* Navigation */}
      <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

      {/* Navigation menu */}
      <nav className={`bg-white z-20 absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
          <div className="border-b-2 border-blue-700 w-full h-40 text-blue-700 flex flex-col items-center justify-center text-xl tracking-wider">
          <img src={GSO} className="w-24 h-24" />
          <h1 className="text-bold text-4xl tracking-widest">PARKING SYSTEM</h1>
        </div>
        <div className="flex flex-col justify-evenly w-full h-2/4 relative">
            <Link to="/admindashboard" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/adminparkingslot" className="group no-underline h-16 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/adminreport" className="group no-underline w-full h-16 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/adminaccount" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsQuestionSquare /> <span className="ml-5">Account</span>
              </li>
            </Link>
        </div>
        <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600" onClick={handleLogout}>
          <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180"/>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <div className="w-full h-screen bg-blue-700">
        <div className="w-full h-20 flex justify-end items-end border-b-2">
          <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Parking Slots</p>
        </div>
        <div className="w-full h-9/10.5 flex flex-col overflow-auto">
          <div onScanSuccess={handleQRCodeScan} className="mt-10 flex flex-col md:flex-row items-center justify-evenly w-full space-y-4 md:space-y-0">
            <div className="bg-gray-700 border text-white p-8 rounded-lg shadow-md w-full max-w-md">
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
                <p className="mt-2 text-sm">{scanResult}</p>
              </div>
              <div className="text-center mb-3"> - OR - </div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Scan QR Code with Camera</h2>
                {isNavOpen ? '' : <><video ref={videoRef} style={{ width: '100%' }} />
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <button onClick={() => setScanning(true)}>Start Scanning</button>
      <button onClick={() => setScanning(false)}>Stop Scanning</button>
      {scanResult && <p>{scanResult}</p>}</> }
              </div>
            </div>
            <div className="w-1/2 h-auto flex relative">
              {isNavOpen ? '' : <img src={Beep} alt="Beep Vehicle Image" className="drop-shadow-2xl w-full md:w-2/3" />}
            </div>
            </div>
            {isPopupVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                <div className="bg-white p-8 rounded-lg shadow-lg h-9/10 w-4/5">
                  <div className="flex justify-between items-center">
                    <div className="flex">
                      <h2 className="text-xl font-bold mr-5">Logs</h2>
                      <button onClick={downloadLogsAsPDF} className="h-10 w-48 bg-red-500 rounded text-white flex justify-evenly items-center hover:bg-red-700">
                        <span>Download Logs</span> <MdOutlineFileDownload />
                      </button>
                    </div>
                    <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">Close</button>
                  </div>

                  {/* Sorting Buttons */}
                  <div className="mt-4 flex space-x-4">
                    <select
                      value={selectedUserType}
                      onChange={(e) => setSelectedUserType(e.target.value)}
                      className="p-2 w-full md:w-40 rounded text-blue-900 font-semibold"
                    >
                      <option value="">All Users</option>
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                    </select>
                    <input
                      onChange={(e) => setSearchTerm(e.target.value)}
                      value={searchTerm}
                      type="text"
                      className="w-full md:w-60 h-10 rounded pl-3 border drop-shadow-xl"
                      placeholder="Search user"
                    />
                  </div>

                  {/* Sorting Selection */}
                  <div className="mt-4 flex space-x-4">
                    <button onClick={() => setIsPopupVisible(true)}>
                      Delete Logs
                    </button>
                  </div>
                  <div>
                    {/* Popup */}
                    {popupVisible && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-1/4">
                          <h2 className="text-xl font-bold mb-4">Delete Logs</h2>
                          <div className="mb-4">
                            <label className="block mb-2">Select Criteria:</label>
                            <select
                              value={selectedSelection}
                              onChange={(e) => setSelectedSelection(e.target.value)}
                              className="p-2 w-full border rounded"
                            >
                              <option value="" disabled  hidden>Select...</option>
                              <option value="student">Students</option>
                              <option value="faculty">Faculty</option>
                            </select>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteLogs(selectedSelection)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setIsPopupVisible(false)}
                              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Logs Table */}
                  <div className="overflow-auto w-full drop-shadow-xl h-4/5 mt-4">
                    <table className="min-w-full table-auto border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">#</th>
                          <th className="border border-gray-300 px-4 py-2">User Type</th>
                          <th className="border border-gray-300 px-4 py-2">User ID</th>
                          <th className="border border-gray-300 px-4 py-2">Student Number</th>
                          <th className="border border-gray-300 px-4 py-2">Name</th>
                          <th className="border border-gray-300 px-4 py-2">Position</th>
                          <th className="border border-gray-300 px-4 py-2">Time In</th>
                          <th className="border border-gray-300 px-4 py-2">Time Out</th>
                          <th className="border border-gray-300 px-4 py-2">Time Stamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs(logs).length > 0 ? (
                          filteredLogs(logs).map((log, index) => (
                            <tr key={log.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{log.user_type}</td>
                            <td className="border border-gray-300 px-4 py-2">{log.user_id}</td>
                            <td className="border border-gray-300 px-4 py-2">{log['Student Number'] || <span className="text-gray-500">NA</span>}</td>
                            <td className="border border-gray-300 px-4 py-2">{log.Name}</td>
                            <td className="border border-gray-300 px-4 py-2">{log.Position || <span className="text-gray-500">NA</span>}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatAMPM(log['Time In'])}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatAMPM(log['Time Out'])}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatDateTime(log.created_at)}</td>
                          </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center p-4">
                              No logs available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {scanning && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                  <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">QR Code Scanner</h2>
                  <div className="relative w-full h-64 mt-4 border-2 border-blue-700 rounded-lg overflow-hidden">
                    <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleCloseModalQR}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          <div className="w-full h-full mt-6">
            <div className="bg-gray-700 w-full p-4 h-auto md:h-full border-2 rounded">
              <div className="mb-4 flex flex-col md: space-y-4 md:space-y-0">
                <div className="relative flex flex-col mb-2 md:flex-row items-center">
                  <label className="mr-4 text-white">Select User Type:</label>
                  <select
                    onChange={(e) => setSelectedUserType(e.target.value)}
                    className="p-2 w-full md:w-40 bg-blue-200 rounded text-blue-900 font-semibold"
                    value={selectedUserType}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                  <button onClick={fetchLogs} className="block mt-3 sm:absolute right-0 bg-gray-400 w-40 h-10 rounded text-white tracking-widest">Logs</button>
                </div>
                <div className="flex flex-col md:flex-row items-center">
                  <label className="mr-4 text-white">Select Vehicle Type:</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="p-2 w-full md:w-40 rounded bg-blue-200 text-blue-900 font-semibold"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    {selectedUserType === 'student' ? (<option value="tricycle">Tricycle</option>) : ''}
                    <option value="fourwheeler">Four Wheeler</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 text-white">
                {renderSpots(categories[selectedVehicle].count, categories[selectedVehicle].color, selectedVehicle)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up for showing user data */}
      {popupData && (
        <div className="fixed inset-0 bg-gray-900 h-screen bg-opacity-50 flex justify-center items-center z-30">
        <div className="bg-white p-4 h-9/11 overflow-auto md:p-8 rounded-lg shadow-lg w-full max-w-2xl mx-2">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Slot User Information</h2>
          <div className="text-sm md:text-base">
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
            <div className="w-full flex md:flex-row justify-around mt-4">
              {licenseSrc ? (
                <div className="flex flex-col items-center">
                  <p>License</p>
                  <div className="flex items-center">
                    <img src={licenseSrc} alt="License" className="w-60 h-40 md:w-40 md:h-32" />
                    <button
                      onClick={() => handleOpenModal(licenseSrc)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      aria-label="View License"
                    >
                      <BsEyeFill className="w-8 h-6 md:w-10 md:h-7"/>
                    </button>
                  </div>
                </div>
              ) : <p className="text-center">No License image available</p>}
              {orcrSrc ? (
                <div className="flex flex-col items-center">
                  <p>ORCR</p>
                  <div className="flex items-center">
                    <img src={orcrSrc} alt="ORCR" className="w-60 h-40 md:w-40 md:h-32" />
                    <button
                      onClick={() => handleOpenModal(orcrSrc)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      aria-label="View ORCR"
                    >
                      <BsEyeFill className="w-8 h-6 md:w-10 md:h-7"/>
                    </button>
                  </div>
                </div>
              ) : <p className="text-center">No ORCR image available</p>}
            </div>
            <div className="w-full flex flex-col md:flex-row items-center justify-evenly mt-16">
              <button
                className="p-2 flex justify-center items-center w-full md:w-48 bg-green-500 text-white text-lg md:text-xl rounded hover:bg-green-700 mb-4 md:mb-0"
                onClick={handleTimeIn}
              >
                Time In <MdTimer className="ml-3"/>
              </button>
              <button
                className="p-2 flex justify-center items-center w-full md:w-48 bg-red-500 text-white text-lg md:text-xl rounded hover:bg-red-700 mb-4 md:mb-0"
                onClick={handleTimeOut}
              >
                Time Out <MdTimerOff className="ml-3"/>
              </button>
            </div>
      
            {isModalOpen && (
              <div className="fixed w-full h-full inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-white p-4 rounded-lg shadow-lg flex justify-center w-2/4 h-2/3">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
                    aria-label="Close Modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img src={modalImageSrc} alt="Enlarged" className="max-w-full max-h-full" />
                </div>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col justify-between mt-5 sm:flex-row gap-2">
            <button
              className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit <FaUserEdit className="ml-3"/>
            </button>
            {selectedUserType === 'student' ? 
              <button className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => handleDelete('student')}>
                Delete Student <MdDeleteForever className="ml-3"/>
              </button> :
              <button className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => handleDelete('faculty')}>
                Delete Faculty <MdDeleteForever className="ml-3"/>
              </button>
            }
            <button
              className="mt-2 md:mt-4 w-full md:w-1/3 p-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={() => setPopupData(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 max-sm:w-full">
        <div className="bg-opacity-50 p-2 rounded-lg max-sm:h-full max-sm:w-full overflow-auto">
          {selectedUserType === 'student' ? (<form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col w-full gap-3 float:right h-auto max-w-3xl p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
              <p className="text-3xl font-semibold tracking-tight relative flex items-center justify-center text-cyan-500 sm:text-2xl max-sm:text-base">
              <BsPersonFillGear className="mr-5 w-10"/> Edit Account
              </p>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
              <label className="relative w-full">
                <input name="studentNumber" value={formData.studentNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" "required/>
                <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Student Number</span>
              </label>
              <label className="relative w-full">
                <input name="fullname" value={formData.fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
              </label>
            </div>
            <label className="relative">
              <input name="email" value={formData.email} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
            </label>
            <label className="relative">
              <input name="yearsection" value={formData.yearsection} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Year & Section</span>
            </label>
            <label className="relative">
              <select name="course" value={formData.course} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5 sm:overflow-auto" type="text" placeholder=" " required >
              <option value="" disabled selected hidden>Course</option>
              <option>BS Civil Engineering</option>
              <option>BS Computer Engineering</option>
              <option>BS Electrical Engineering</option>
              <option>BS Electronics Engineering</option>
              <option>BS Mechanical Engineering</option>
              <option>BS Hospitality Management</option>
              <option>BS Biology - Microbiology</option>
              <option>BS Mathematics</option>
              <option>BS Psychology</option>
              <option>BS Computer Science</option>
              <option>Bachelor in Human Services</option>
              <option>Bachelor of Elementary Education</option>
              <option>Bachelor of Secondary Education - Science</option>
              <option>Bachelor of Secondary Education - English</option>
              <option>Bachelor of Secondary Education - Mathematics</option>
              <option>Bachelor of Livelihood Education - Home Economics</option>
              <option>Bachelor of Livelihood Education - Industrial Arts</option>
              <option>Bachelor of Livelihood Education - Information and Communication Technology</option>
              <option>Bachelor of Technical Vocational Teacher Education - Drafting Technology</option>
              <option>Bachelor of Industrial Technology - Automotive Technology</option>
              <option>Bachelor of Industrial Technology - Architectural Drafting Technology</option>
              <option>Bachelor of Industrial Technology - Construction Technology</option>
              <option>Bachelor of Industrial Technology - Electrical Technology</option>
              <option>Bachelor of Industrial Technology - Electronics Technology</option>
              <option>Bachelor of Industrial Technology - Heating, Ventilating and Air-conditioning</option>
            <option>Bachelor of Industrial Technology - Mechanical Technology</option>
              </select>
            </label>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
              <label className="relative w-full">
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-red-500 py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" disabled required>
                  <option>{popupData.Vehicle}</option>
                </select>
              </label>
              <label className="relative w-full">
                <input name="plateNumber" value={formData.plateNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Plate Number</span>
              </label>
            </div>
            <label className="relative">
              <input name="password" value={formData.password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="password" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
            </label>
            <div>
              <label for="formFile" class="form-label">License</label>
              <input name="license" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
            </div>
            <div>
              <label for="formFile" class="form-label">ORCR</label>
              <input name="orcr" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
            </div>
            <div className="flex justify-end justify-between">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded w-1/2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-1/2"
              >
                Save Changes
              </button>
            </div>
          </form>) : (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
              <div className="bg-gray-900 bg-opacity-90 rounded-lg max-w-3xl w-full max-sm:w-full overflow-auto">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex p-3 flex-col w-full gap-3 h-auto bg-gray-900 text-white border border-gray-700 rounded-lg">
                <p className="text-3xl font-semibold tracking-tight relative flex items-center justify-center text-cyan-500 sm:text-2xl max-sm:text-base">
                  <BsPersonFillGear className="mr-5 w-10"/> Edit Account
                </p>
                <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                  <label className="relative w-full">
                    <input name="fullname" value={formData.fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                    <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
                  </label>
                  <label className="relative w-full">
                    <input name="email" value={formData.email}  onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
                    <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
                  </label>
                </div>
                <label className="relative">
                  <input name="position" value={formData.position} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Position</span>
                </label>
                <label className="relative">
                  <input name="building" value={formData.building} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Building</span>
                </label>
                <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                  <label className="relative w-full">
                    <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-red-500 py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" disabled required>
                      <option>{popupData.Vehicle}</option>
                    </select>
                  </label>
                  <label className="relative w-full">
                    <input name="plateNumber" value={formData.plateNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                    <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Plate Number</span>
                  </label>
                </div>
                <label className="relative">
                  <input name="password" value={formData.password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="password" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
                </label>
                <div>
                  <label for="formFile" class="form-label">License</label>
                  <input name="license" onChange={handleFileChange} class="form-control" type="file" id="formFile" />
                </div>
                <div>
                  <label for="formFile" class="form-label">ORCR</label>
                  <input name="orcr" onChange={handleFileChange} class="form-control" type="file" id="formFile" />
                </div>
                  <div className="flex justify-end justify-between">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded w-1/2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-1/2"
                    >
                    Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>)}
        </div>
      </div>
      )}
    </div>
  );
}