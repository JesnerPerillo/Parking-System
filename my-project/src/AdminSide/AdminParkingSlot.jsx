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
import { FaUserEdit, FaUsers, FaCamera  } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import GSO from '../Pictures/gsoo.png';
import { IoEyeOff, IoEye } from "react-icons/io5";
import { FaChalkboardUser, FaRegCircleCheck } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";

export default function AdminParkingSlot() {
  const [userData, setUserData] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [images, setImages] = useState({});
  const [selectedUserType, setSelectedUserType] = useState('student');
  const [selectedVehicle, setSelectedVehicle] = useState('motorcycle');
  const [updateConfirm, setUpdateConfirm] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [licenseSrc, setLicenseSrc] = useState(null);
  const [orcrSrc, setOrcrSrc] = useState(null);
  const [corSrc, setCorSrc] = useState(null);
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
  const [timeinConfirm, setTimeinConfirm] = useState(false);
  const [timeinSuccess, setTimeinSuccess] = useState(false);
  const [timeoutConfirm, setTimeoutConfirm] = useState(false);
  const [timeoutSuccess, setTimeoutSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeleteUserType, setConfirmDeleteUserType] = useState('');
  const [confirmDeleteSuccess, setconfirmDeleteSuccess] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [confirmDeleteLogs, setConfirmDeleteLogs] = useState(false);
  const [selectedDeletedLogs, setSelectedDeletedLogs] = useState(false);
  const [deleteLogsSuccess, setDeleteLogsSuccess] = useState(false);
  const [parkingAvailable, setParkingAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/adminfetchdata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
          navigate('/');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ', error);
        navigate('/');
      }
    };

    fetchData();
  }, []);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }


  const closePopup = () => {
    setPopupVisible(false);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const [formData, setFormData] = useState({
    student: {
      studentNumber: '',
      fullname: '',
      email: '',
      yearsection: '',
      course: '',
      vehicleType: '',
      plateNumber: '',
      password: '',
      license: null,
      orcr: null,
      cor: null,
    },
    faculty: {
      employeeId: '',
      fullname: '',
      email: '',
      position: '',
      building: '',
      vehicleType: '',
      plateNumber: '',
      password: '',
      license: null,
      orcr: null,
    },
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [selectedUserType]: {
        ...prevData[selectedUserType],
        [name]: value,
      },
    }));
  };
  
  
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [selectedUserType]: {
        ...prevData[selectedUserType],
        [name]: files[0], // Handling file inputs
      },
    }));
  };
  


  const handleSubmit = async (e, type) => {
    e.preventDefault();

    // Show confirmation modal
    setUpdateConfirm(true);
};

// This function will handle the actual submission after confirmation
const handleConfirmSubmit = async () => {
  setErrorMessage(''); // Clear previous error message
  const form = new FormData();
  const currentFormData = formData[selectedUserType];

  for (const key in currentFormData) {
      form.append(key, currentFormData[key]);
  }

  form.append('id', popupData.id);

  const url = selectedUserType === 'student'
      ? 'https://skyblue-clam-769210.hostingersite.com/admineditstudent.php'
      : 'https://skyblue-clam-769210.hostingersite.com/admineditfaculty.php';

  console.log('Form data being sent:', Array.from(form.entries()));

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
              ...currentFormData,
              password: '', // Don't show the password in user data
          }));
          setUpdateSuccess(true); 
          setPopupData(false)
          setIsEditModalOpen(false);
      } else {
          // Set error message from backend response
          setErrorMessage(response.data.message || 'An error occurred. Please try again.');
          setUpdateSuccess(false); // Show error pop-up
      }
  } catch (error) {
      console.error('Error updating account:', error);
      setErrorMessage('Error updating account. Please try again.'); // Set error message
      setUpdateSuccess(false); // Show error pop-up
  } finally {
      setUpdateConfirm(false); // Close confirmation modal
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
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/logout.php', {
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
          ? 'https://skyblue-clam-769210.hostingersite.com/facultyfetchoccupiedslot.php'
          : 'https://skyblue-clam-769210.hostingersite.com/fetchoccupiedslot.php';

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
      setParkingAvailable(true);
    } else {
      try {
        const fetchUrl = selectedUserType === 'faculty'
          ? 'https://skyblue-clam-769210.hostingersite.com/fetchfacultydata.php'
          : 'https://skyblue-clam-769210.hostingersite.com/fetchstudentsdata.php';
  
        const response = await axios.get(fetchUrl, { withCredentials: true });
  
        if (response.data.success) {
          const data = selectedUserType === 'faculty' ? response.data.faculty : response.data.students;
          
  
          const userData = data.find(user => {
            console.log(`Checking user: ${user.fullname}, Slot: ${user.slot_number}, Vehicle: ${user.slot_type}`);
            return user.slot_number === spotNumberStr && user.slot_type === selectedVehicle;
          });
  
          if (userData) {
            setPopupData(userData);
            setLicenseSrc(userData.License ? `data:image/jpeg;base64,${userData.License}` : null);
            setOrcrSrc(userData.ORCR ? `data:image/jpeg;base64,${userData.ORCR}` : null);
            if (selectedUserType === 'student') {
              setCorSrc(userData.COR ? `data:image/jpeg;base64,${userData.COR}` : null);
            } else {
              setCorSrc(null);
            }
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
  

  const [occupiedSpots, setOccupiedSpots] = useState({
    motorcycle: [],
    tricycle: [],
    fourwheeler: []
});

const [categories, setCategories] = useState({
    motorcycle: { count: 0, color: 'bg-green-500 text-white' },
    tricycle: { count: 0, color: 'bg-green-500 text-white' },
    fourwheeler: { count: 0, color: 'bg-green-500 text-white' }
});

// Fetch vehicle counts based on selected user type
useEffect(() => {
    const fetchVehicleCounts = async () => {
        try {
            const endpoint = selectedUserType === 'student' 
                ? 'https://skyblue-clam-769210.hostingersite.com/getvehiclecount.php' 
                : 'https://skyblue-clam-769210.hostingersite.com/facultygetvehiclecount.php';

            const response = await axios.get(endpoint);
            const { motorcycle, tricycle, fourwheeler } = response.data;

            // Update the categories and occupied spots
            setCategories(prevCategories => ({
                ...prevCategories,
                motorcycle: { ...prevCategories.motorcycle, count: motorcycle },
                tricycle: { ...prevCategories.tricycle, count: tricycle },
                fourwheeler: { ...prevCategories.fourwheeler, count: fourwheeler }
            }));

            // Assuming your API also returns occupied spots
            setOccupiedSpots({
                motorcycle: response.data.occupiedMotorcycle || [],
                tricycle: response.data.occupiedTricycle || [],
                fourwheeler: response.data.occupiedFourwheeler || []
            });

        } catch (error) {
            console.error('Error fetching vehicle counts:', error);
        }
    };

    fetchVehicleCounts();
}, [selectedUserType]);
  
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
    try {
        if (!popupData || !popupData.id) {
            alert('User ID is missing.');
            return;
        }
        
        console.log('Sending request with:', { id: popupData.id, userType });

        const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/delete.php', 
            { 
                id: popupData.id,
                userType: userType
            }, 
            { 
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        console.log('Response data:', response.data);
        if (response.data.success) {
            setconfirmDeleteSuccess(true);
            setConfirmDelete(false);
            setPopupData(null);
        } else {
            alert('Failed to delete user: ' + (response.data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + (error.response ? error.response.data.message : error.message));
    }
};

  

  const updateTime = async (userType, id, timeIn, timeOut) => {
    try {
        const response = await fetch('https://skyblue-clam-769210.hostingersite.com/settime.php', {
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
      const response = await fetch('https://skyblue-clam-769210.hostingersite.com/logs.php', {
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
  
    // Manually adjust to UTC+8
    const utcOffset = 8 * 60 * 60 * 1000; // UTC+8 in milliseconds
    const localDate = new Date(date.getTime() + utcOffset);
  
    // Array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Extract date components
    const day = localDate.getDate();
    const month = months[localDate.getMonth()];
    const year = localDate.getFullYear();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
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
  setTimeinSuccess(true);
  setTimeinConfirm(false);
  setPopupData(false);
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
  setTimeoutSuccess(true);
  setTimeoutConfirm(false);
  setPopupData(false);
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
      ? 'https://skyblue-clam-769210.hostingersite.com/fetchfacultydata.php'
      : 'https://skyblue-clam-769210.hostingersite.com/fetchstudentsdata.php';

    const response = await axios.get(fetchUrl, { withCredentials: true });
    
    if (response.data.success) {
      const data = selectedUserType === 'faculty' ? response.data.faculty : response.data.students;
      
      // Find user based on both slot type and slot number
      const userData = data.find(user => 
        user.slot_number === slotNumber && user.slot_type === slotType
      );

      if (userData) {
        setPopupData(userData);
        setLicenseSrc(userData.License ? `data:image/jpeg;base64,${userData.License}` : null);
        setOrcrSrc(userData.ORCR ? `data:image/jpeg;base64,${userData.ORCR}` : null);
        if (selectedUserType === 'student') {
          setCorSrc(userData.COR ? `data:image/jpeg;base64,${userData.COR}` : null);
        } else {
          setCorSrc(null);
        }
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

const handleViewImage = async (id, imageType) => {
  try {
      const apiUrl = selectedUserType === 'student'
          ? `https://skyblue-clam-769210.hostingersite.com/fetchstudentsimage.php?id=${id}`
          : `https://skyblue-clam-769210.hostingersite.com/fetchfacultyimage.php?id=${id}`;

      const response = await axios.get(apiUrl, { withCredentials: true });

      if (response.data.success) {
          // Set the modal image source based on the image type
          let imageSrc;
          switch (imageType) {
              case 'License':
                  imageSrc = `data:image/jpeg;base64,${response.data.images.License}`;
                  break;
              case 'ORCR':
                  imageSrc = `data:image/jpeg;base64,${response.data.images.ORCR}`;
                  break;
              case 'COR':
                  imageSrc = `data:image/jpeg;base64,${response.data.images.COR}`;
                  break;
              default:
                  return;
          }

          setModalImageSrc(imageSrc);
          setError(null);
          setIsModalOpen(true); // Open the modal
      } else {
          setImages({});
          setError(response.data.message || 'No images found.');
      }
  } catch (error) {
      setImages({});
      setError('Error fetching images: ' + error.message);
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


  const downloadLogsAsPDF = async () => {
    try {
      // Fetch logs from your server
      const response = await fetch('https://skyblue-clam-769210.hostingersite.com/logs.php', {
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

  
  const [popupVisible, setIsPopupVisible] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState('');

  const formatTime = (time) => {
    return time ? new Date(time).toLocaleTimeString().toLowerCase() : '';
  };
  
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString().toLowerCase() : '';
  };
  
  const filteredLogs = (logs) => {
    const term = searchTerm.toLowerCase();
  
    return logs.filter(log => {
      const matches = [
        log.Name?.toLowerCase().includes(term),
        log.Position?.toLowerCase().includes(term),
        log['Student Number']?.toLowerCase().includes(term),
        log.user_type?.toLowerCase().includes(term),
        formatTime(log['Time In']).includes(term),
        formatDate(log.created_at).includes(term),
        formatDate(log['Time Stamp']).includes(term),
      ];
  
      // Debugging: Log the match results for each log
      console.log('Log:', log, 'Matches:', matches);
  
      return matches.some(Boolean); // Returns true if any match is found
    });
  };
  

  const handleDeleteLogs = async (selection) => {
    try {
      // Log the data being sent
      console.log('Sending request with:', { selection });

      // Send POST request
      const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/logsdelete.php',
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
        setDeleteLogsSuccess(true)
        setConfirmDeleteLogs(false);
        setIsPopupVisible(false); // Hide popup on success
      } else {
        alert('Failed to delete logs: ' + response.data.message);
      }
    } catch (error) {
      alert('Error deleting logs: ' + error.message);
    }
  };

  const [vehicleCountOpen, setVehicleCountOpen] = useState(false);
  const [vehicleUserType, setVehicleUserType] = useState('student');
  const [confirmUpdateCount, setConfirmUpdateCount] = useState(false);
  const [updateCountMessage, setUpdateCountMessage] = useState(false);
  const [vehicleCounts, setVehicleCounts] = useState({
    motorcycle: 0,
    tricycle: 0,
    fourwheeler: 0,
  });
  const [newCounts, setNewCounts] = useState({
    motorcycle: '',
    tricycle: '',
    fourwheeler: '',
  });

  useEffect(() => {
    // Fetch the current vehicle counts based on selected user type (student/faculty)
    fetchVehicleCounts();
  }, [vehicleUserType]);

  const fetchVehicleCounts = async () => {
    try {
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/admingetvehiclecount.php', {
        withCredentials: true, // To handle session cookies
      });

      if (response.data.success) {
        const { studentCounts, facultyCounts } = response.data; // Adjusted according to your backend response

        // Set vehicle counts based on user type
        if (vehicleUserType === 'student') {
          setVehicleCounts({
            motorcycle: studentCounts.motorcycle || 0,
            tricycle: studentCounts.tricycle || 0,
            fourwheeler: studentCounts.fourwheeler || 0,
          });
        } else if (vehicleUserType === 'faculty') {
          setVehicleCounts({
            motorcycle: facultyCounts.motorcycle || 0,
            tricycle: 0, // No tricycle for faculty
            fourwheeler: facultyCounts.fourwheeler || 0,
          });
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching vehicle counts:", error);
    }
  };

  const handleUserTypeChange = (e) => {
    setVehicleUserType(e.target.value);
  };

  const handleChangeVehicleCount = async () => {
    try {
        const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/adminupdatevehiclecount.php', {
            vehicleUserType: String(vehicleUserType), // Ensure this is a string
            motorcycle: Number(newCounts.motorcycle) || vehicleCounts.motorcycle, // Ensure this is a number
            tricycle: vehicleUserType === 'student' ? (Number(newCounts.tricycle) || vehicleCounts.tricycle) : 0, // Ensure this is a number and default to 0 if not a student
            fourwheeler: Number(newCounts.fourwheeler) || vehicleCounts.fourwheeler, // Ensure this is a number
        }, { withCredentials: true });

        // Check if response data has success property
        if (response.data && response.data.success) {
            setUpdateCountMessage(true);
            setConfirmUpdateCount(false);
            setVehicleCountOpen(false);
            fetchVehicleCounts(); // Refresh the counts after successful update
        } else {
            // Provide more informative error messages
            alert(response.data.message || "An unexpected error occurred.");
        }
    } catch (error) {
        console.error("Error updating vehicle counts:", error);
        alert("An error occurred while updating vehicle counts. Please check the console for details.");
    }
};

const [selectedMap, setSelectedMap] = useState(null);
  const [mapType, setMapType] = useState('');
  const [uploadMapType, setUploadMapType] = useState('student');
  const [imageUrl, setImageUrl] = useState(null);
  const [showFileInput, setShowFileInput] = useState(false);
  const [showMapSelectionPopup, setShowMapSelectionPopup] = useState(false); 
  const [mapSuccess, setMapSuccess] = useState(false);
  const [noMap, setNoMap] = useState(false);


  const handleMapTypeChange = (e) => {
    setUploadMapType(e.target.value);  // Updates the map type (student or faculty)
};

const handleMapChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Check file type (only allow image files)
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
            e.target.value = "";  // Clear the file input
            return;
        }

        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds the 10MB limit.");
            e.target.value = "";  // Clear the file input
            return;
        }

        setSelectedMap(file);  // Updates the selected map file
    }
};

const handleUpload = async () => {
  if (!selectedMap) {
      setNoMap(true);
      return;
  }

  console.log('Selected Map:', selectedMap); // Check if the file is selected

  const formData = new FormData();
  formData.append("map", selectedMap);
  formData.append("uploadMapType", uploadMapType);

  try {
      const response = await axios.post("https://skyblue-clam-769210.hostingersite.com/uploadmap.php", formData, {
          withCredentials: true,
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });

      console.log("Response from backend:", response.data);

      const result = response.data;
      if (result.message) {
          setMapSuccess(true);
      } else {
          alert(result.error || "An error occurred");
      }
  } catch (error) {
      console.error("Error uploading map:", error);
      alert("Error uploading map");
  }
};

  const handleEditMap = () => {
    setShowFileInput(true);
  };

  const fetchMap = async (selectedMapType) => {
    try {
        const response = await axios.get(`https://skyblue-clam-769210.hostingersite.com/getmap.php?mapType=${selectedMapType}`, {
            withCredentials: true,
            responseType: "blob",
        });
        
        const imageUrl = URL.createObjectURL(response.data);
        setImageUrl(imageUrl);
    } catch (error) {
        console.error("Error fetching map:", error);
        alert("Error fetching map");
    }
};

useEffect(() => {
    if (mapType) {
        fetchMap(mapType); // Fetch the map only when mapType is updated
    }
}, [mapType]);

const handleViewMap = () => {
    fetchMap(); 
    setShowMapSelectionPopup(false); 
};

  


  return (
    <div className="relative w-full h-screen bg-blue-700 flex">
      <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-40"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        <nav className={`bg-white z-30 rounded-r-2xl drop-shadow-2xl absolute inset-y-0 left-0 transform xl:w-1/5 lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
          <div className=" w-full h-40 text-blue-700 flex flex-col items-center justify-center text-xl tracking-wider">
              <img src={GSO} className="w-24 h-24" />
              <h1 className="text-2xl tracking-widest lg:text-sm xl:text-2xl">PARKING SYSTEM</h1>
            </div>
          <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/admindashboard" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/adminparkingslot" className="group no-underline h-14 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-lg text-white tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slots</span>
              </li>
            </Link>
            <Link to="/adminreport" className="group no-underline w-full h-12 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/adminaccount" className="group no-underline h-12 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsQuestionSquare /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/adminuserlist" className="group no-underline h-12 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <FaUsers /> <span className="ml-5">User List</span>
              </li>
            </Link>
          </div>
          <button className="w-full bg-blue-900 h-12 text-red-600 font-semibold tracking-widest text-lg bg-white flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
        </nav>

      {/* Main Content */}
      <div className="w-full h-screen bg-blue-700">
        <div className="w-full h-20 flex justify-end items-end border-b-2">
          <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Parking Slot</p>
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
            {!scanning ? (
              <button
                onClick={() => setScanning(true)}
                className="w-full flex justify-center items-center bg-yellow-700 hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
              >
                Start Scanning <FaCamera className="ml-5"/>
              </button>
            ) : (
              <p className="text-center">Scanning...</p>
            )}
            <video ref={videoRef} style={{ width: '100%', height: 'auto' }}></video>
          </div>
        </div>
            <div className="w-1/2 h-auto flex relative">
              {isNavOpen ? '' : <img src={Beep} alt="Beep Vehicle Image" className="drop-shadow-2xl w-full md:w-2/3" />}
            </div>
            </div>
            {isPopupVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                              onClick={() => {setConfirmDeleteLogs(true);
                                setSelectedDeletedLogs(selectedSelection)}}
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
                <div className="relative flex flex-col mb-2 md:flex-row items-center justify-between">
                  <div>
                    <label className="mr-4 text-white">Select User Type:</label>
                    <select
                      onChange={(e) => setSelectedUserType(e.target.value)}
                      className="p-2 w-full md:w-40 bg-blue-200 rounded text-blue-900 font-semibold"
                      value={selectedUserType}
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-between items-center mt-3 sm:flex-row">
                  <div className="flex justify-center items-center">
                    {/* Floating container for the map, buttons, and file input */}
                    <div className=" flex flex-col items-center justify-center rounded-lg shadow-lg w-auto max-w-full sm:flex-row">
                      {/* Button to trigger the map selection popup */}
                      <button
                        onClick={() => setShowMapSelectionPopup(true)}
                        className="w-40 h-10 mr-0 text-white bg-blue-700 rounded mt-3 sm:mr-3 mt-0"
                      >
                        Vicinity Map
                      </button>

                      {/* Map selection popup */}
                      {showMapSelectionPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                          <div className="bg-white p-6 rounded shadow-lg w-80">
                            <h2 className="text-lg font-bold mb-4">Select Map Type</h2>
                            <div>
                              <button
                                onClick={() => {
                                  setMapType("student");
                                  handleViewMap();
                                }}
                                className={`w-full py-2 px-4 rounded mb-2 text-white bg-blue-700`}
                              >
                                Student Map
                              </button>
                              <button
                                onClick={() => {
                                  setMapType("faculty");
                                  handleViewMap();
                                }}
                                className={`w-full py-2 px-4 rounded text-white bg-blue-700`}
                              >
                                Faculty Map
                              </button>
                            </div>
                            <button
                              onClick={() => setShowMapSelectionPopup(false)}
                              className="mt-4 w-full py-2 bg-red-600 text-white rounded"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Display the selected map */}
                      {imageUrl && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                          <div className="mt-4 w-3/5 h-3/4 relative flex justify-center items-center">
                            <img src={imageUrl} alt={`${mapType} map`} className="w-full h-full object-fill rounded-lg" />
                            <button onClick={() => setImageUrl(false)} className="w-20 h-8 bg-gray-400 rounded text-white absolute top-5 right-5">Close</button>
                          </div>
                          
                        </div>
                      )}

                      {/* Upload Map button */}
                      <button
                        onClick={handleEditMap}
                        className="w-40 h-10 text-white bg-green-700 rounded mr-0 mt-0 sm:mr-3 mt-3"
                      >
                        Edit Vicinity Map
                      </button>

                      {/* File input for uploading the map */}
                      {showFileInput && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                      <div className="mt-3 p-3 rounded bg-white w-9/10 h-3/4 flex flex-col justify-around items-center sm:h-1/3 sm:w-1/5">
                          <h3>Change Map</h3>
                          <div className="mb-3 w-full">
                              <label className="block text-sm mb-2">Select Map Type</label>
                              <select
                                  value={uploadMapType}
                                  onChange={handleMapTypeChange}
                                  className="border p-2 w-full rounded"
                              >
                                  <option value="student">Student Map</option>
                                  <option value="faculty">Faculty Map</option>
                              </select>
                          </div>
                          <input
                              type="file"
                              accept="image/*"
                              onChange={handleMapChange}
                              required
                              className="border p-2 w-full mb-3 rounded"
                          />
                          <button
                              onClick={handleUpload}
                              className="w-full bg-blue-600 text-white py-2 rounded"
                          >
                              Upload Map
                          </button>
                          <button
                              onClick={() => setShowFileInput(false)}
                              className="w-full bg-gray-600 text-white py-2 rounded"
                          >
                              Close
                          </button>
                      </div>
                  </div>
              )}
                    </div>
                  </div>
                    <button onClick={() => setVehicleCountOpen(true)} className="w-40 h-10 bg-blue-700 mt-3 rounded text-white sm:mt-0">Vehicle Count</button>
                    <button onClick={fetchLogs} className="block ml-0 mt-0 bg-gray-400 w-40 h-10 rounded text-white tracking-widest sm:ml-3 mt-3">Logs</button>
                  </div>
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

                {/*Rendering Spots */}
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
                <p><strong>Employee Id:</strong> {popupData['Employee Id'] || 'N/A'}</p>
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
            <div className="w-full flex flex-col md:flex-row justify-around mt-20">
              <div className="flex flex-col items-center">
                <button className="flex justify-center items-center" onClick={() => handleViewImage(popupData.id, 'License')}>View License <HiMagnifyingGlass className="ml-2"/></button>
              </div>
              <div className="flex flex-col items-center">
                <button className="flex justify-center items-center" onClick={() => handleViewImage(popupData.id, 'ORCR')}>View ORCR <HiMagnifyingGlass className="ml-2"/></button>
              </div>
            {selectedUserType === 'student' ? <>
              <div className="flex flex-col items-center">
                <button className="flex justify-center items-center" onClick={() => handleViewImage(popupData.id, 'COR')}>View COR <HiMagnifyingGlass className="ml-2"/></button>
              </div></> : ''}
            </div>
            <div className="w-full flex flex-col md:flex-row items-center justify-evenly mt-16">
              <button
                className="p-2 flex justify-center items-center w-full md:w-48 bg-green-500 text-white text-lg md:text-xl rounded hover:bg-green-700 mb-4 md:mb-0"
                onClick={() => setTimeinConfirm(true)}
              >
                Time In <MdTimer className="ml-3"/>
              </button>
              <button
                className="p-2 flex justify-center items-center w-full md:w-48 bg-red-500 text-white text-lg md:text-xl rounded hover:bg-red-700 mb-4 md:mb-0"
                onClick={() => setTimeoutConfirm(true)}
              >
                Time Out <MdTimerOff className="ml-3"/>
              </button>
            </div>
            {isModalOpen && (
              <div className="fixed w-full h-full inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-white p-1 rounded-lg shadow-lg flex justify-center w-full h-auto sm:w-2/4 h-4/5">
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
            {selectedUserType === 'student' ? <button
              className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {setIsEditModalOpen(true);
              }}
            >
              Edit <FaUserEdit className="ml-3"/>
            </button> : <button
              className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setIsEditModalOpen(true);
              }}
            >
              Edit <FaUserEdit className="ml-3" />
            </button>}
            {selectedUserType === 'student' ? 
              <button className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => {
                setConfirmDelete(true); 
                setConfirmDeleteUserType('student')}}>
                Delete Student <MdDeleteForever className="ml-3"/>
              </button> :
              <button className="mt-2 flex justify-center items-center md:mt-4 w-full md:w-1/3 p-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => {
                setConfirmDelete(true); 
                setConfirmDeleteUserType('faculty')}}>
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
      {isEditModalOpen &&(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 max-sm:w-full">
        <div className="bg-opacity-50 p-2 rounded-lg max-sm:h-full max-sm:w-full overflow-auto">
          {selectedUserType === 'student' ? (<form onSubmit={(e) => handleSubmit(e, 'student')} encType="multipart/form-data" className="flex flex-col w-full gap-3 float:right h-auto max-w-3xl p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
              <p className="text-3xl font-semibold tracking-tight relative flex items-center justify-center text-cyan-500 sm:text-2xl max-sm:text-base">
              <BsPersonFillGear className="mr-5 w-10"/> Edit Account
              </p>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
              <label className="relative w-full">
                <input name="studentNumber" value={formData[selectedUserType].studentNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" "required/>
                <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Student Number</span>
              </label>
              <label className="relative w-full">
                <input name="fullname" value={formData[selectedUserType].fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
              </label>
            </div>
            <label className="relative">
              <input name="email" value={formData[selectedUserType].email} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
            </label>
            <label className="relative">
              <input name="yearsection" value={formData[selectedUserType].yearsection} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Year & Section</span>
            </label>
            <label className="relative">
              <select name="course" value={formData[selectedUserType].course} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5 sm:overflow-auto" type="text" placeholder=" " required >
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
                <select name="vehicleType" value={formData[selectedUserType].vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-red-500 py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" disabled required>
                  <option>{popupData.Vehicle}</option>
                </select>
              </label>
              <label className="relative w-full">
                <input name="plateNumber" value={formData[selectedUserType].plateNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Plate Number</span>
              </label>
            </div>
            <label className="relative">
              <input name="password" value={formData[selectedUserType].password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type={showPassword ? 'text' : 'password'} placeholder=" " required />
              <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
              <button type="button" onClick={togglePassword} className="absolute right-5 top-4">
                {showPassword ? <IoEyeOff className="w-6 h-6" /> : <IoEye className="w-6 h-6" />}
              </button>
            </label>
            <div>
              <label for="formFile" class="form-label">License</label>
              <input name="license" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
            </div>
            <div>
              <label for="formFile" class="form-label">ORCR</label>
              <input name="orcr" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
            </div>
            <div>
              <label for="formFile" class="form-label">COR</label>
              <input name="cor" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
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
                type="button"
                onClick={(e) => handleSubmit(e, selectedUserType)
                }
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded w-1/2"
              >
                Save Changes
              </button>
            </div>
          </form>) : (<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
              <div className="bg-gray-900 bg-opacity-90 rounded-lg max-w-3xl w-full max-sm:w-full overflow-auto">
                <form onSubmit={(e) => handleSubmit(e, 'faculty')} encType="multipart/form-data" className="flex p-3 flex-col w-full gap-3 h-auto bg-gray-900 text-white border border-gray-700 rounded-lg">
                <p className="text-3xl font-semibold tracking-tight relative flex items-center justify-center text-cyan-500 sm:text-2xl max-sm:text-base">
                  <BsPersonFillGear className="mr-5 w-10"/> Edit Account
                </p>
                <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                  <label className="relative w-full">
                    <input name="employeeId" value={formData[selectedUserType].employeeId}  onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                    <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Employee Id</span>
                  </label>
                  <label className="relative w-full">
                    <input name="fullname" value={formData[selectedUserType].fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                    <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
                  </label>
                </div>
                <label className="relative w-full">
                    <input name="email" value={formData[selectedUserType].email}  onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
                    <span className="text-gray-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
                  </label>
                <label className="relative">
                  <input name="position" value={formData[selectedUserType].position} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Position</span>
                </label>
                <label className="relative">
                  <input name="building" value={formData[selectedUserType].building} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Building</span>
                </label>
                <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                  <label className="relative w-full">
                    <select name="vehicleType" value={formData[selectedUserType].vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-red-500 py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" disabled required>
                      <option>{popupData.Vehicle}</option>
                    </select>
                  </label>
                  <label className="relative w-full">
                    <input name="plateNumber" value={formData[selectedUserType].plateNumber} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                    <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Plate Number</span>
                  </label>
                </div>
                <label className="relative">
                  <input name="password" value={formData[selectedUserType].password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type={showPassword ? 'text' : 'password'} placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
                  <button type="button" onClick={togglePassword} className="absolute right-5 top-4">
                    {showPassword ? <IoEyeOff className="w-6 h-6" /> : <IoEye className="w-6 h-6" />}
                  </button>
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
                      onClick={(e) => handleSubmit(e, selectedUserType)
                      }
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

      {vehicleCountOpen && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="admin-vehicle-count-form bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-center mb-4">Admin Vehicle Count Management</h2>

            <div className="mb-4">
              <label className="block mb-2">Select User Type:</label>
              <select
                value={vehicleUserType}
                onChange={handleUserTypeChange}
                className="p-2 border border-gray-300 rounded w-full"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            <div className="vehicle-counts mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Current Vehicle Counts for {vehicleUserType.charAt(0).toUpperCase() + vehicleUserType.slice(1)}
              </h3>
              <div className="flex justify-between">
                <label>Motorcycle:</label>
                <span>{vehicleCounts.motorcycle}</span>
              </div>
              {vehicleUserType === 'student' && (
                <div className="flex justify-between">
                  <label>Tricycle:</label>
                  <span>{vehicleCounts.tricycle}</span>
                </div>
              )}
              <div className="flex justify-between">
                <label>Fourwheeler:</label>
                <span>{vehicleCounts.fourwheeler}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Update Vehicle Counts</h3>
            <div className="mb-2">
              <label className="block mb-1">Motorcycle:</label>
              <input
                type="number"
                value={newCounts.motorcycle}
                onChange={(e) => setNewCounts({ ...newCounts, motorcycle: e.target.value })}
                placeholder="Enter new motorcycle count"
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            {vehicleUserType === 'student' && (
              <div className="mb-2">
                <label className="block mb-1">Tricycle:</label>
                <input
                  type="number"
                  value={newCounts.tricycle}
                  onChange={(e) => setNewCounts({ ...newCounts, tricycle: e.target.value })}
                  placeholder="Enter new tricycle count"
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-1">Fourwheeler:</label>
              <input
                type="number"
                value={newCounts.fourwheeler}
                onChange={(e) => setNewCounts({ ...newCounts, fourwheeler: e.target.value })}
                placeholder="Enter new fourwheeler count"
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>

            <button
              onClick={() => setConfirmUpdateCount(true)}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Update Counts
            </button>
            <button className="mt-2 w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200" onClick={() => setVehicleCountOpen(false)}>
                Cancel
              </button>
          </div>
        </div>
      )}

        {mapSuccess && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
              <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
              <p>Map updated successfully.</p>
              <div className="flex justify-around mt-4">
                <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setMapSuccess(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {noMap && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <BsExclamationTriangle className="w-12 text-red-500 h-12"/>
              <p>Please select a map file.</p>
              <div className="flex justify-around mt-4">
                <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setNoMap(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmUpdateCount && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Update Vehicle Count</h2>
            <p>Are you sure you want to update vehicle count?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setConfirmUpdateCount(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleChangeVehicleCount}>
                Confirm
              </button>
            </div>
          </div>
        </div>
        )}

        {updateCountMessage && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
            <p>Update Vehicle Count Successfully.</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setUpdateCountMessage(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        )}    

        {logoutMessage && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setLogoutMessage(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        )}

        {timeinConfirm && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Time in</h2>
            <p>Are you sure you want to Time in?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setTimeinConfirm(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleTimeIn}>
                Confirm
              </button>
            </div>
          </div>
        </div>
        )}

        {timeinSuccess && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
            <p>Time in Successfully.</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setTimeinSuccess(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
        )}

        {timeoutConfirm && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Time Out</h2>
            <p>Are you sure you want to Time out?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setTimeoutConfirm(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleTimeOut}>
                Confirm
              </button>
            </div>
          </div>
        </div>
        )}

        {timeoutSuccess && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
            <p>Time out Successfully.</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setTimeoutSuccess(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
        )}

        {confirmDelete && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Update User</h2>
            <p>Are you sure you want to update this user?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" type="submit">
                Confirm
              </button>
            </div>
          </div>
        </div>
        )}

        {confirmDeleteSuccess && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
            <p>Deleted Successfully.</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setconfirmDeleteSuccess(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
        )}

        {parkingAvailable && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <p>This parking spot is available.</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setParkingAvailable(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
        )}

        {updateConfirm && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-center rounded-lg shadow-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Update</h2>
            <p>Are you sure that the informations are correct?</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setUpdateConfirm(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleConfirmSubmit}>
                Confirm
              </button>
            </div>
          </div>
        </div>
        )}

        {updateSuccess && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
              <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
              <p>Account updated successfully.</p>
              <div className="flex justify-around mt-4">
                <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setUpdateSuccess(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white text-center rounded-lg shadow-lg p-5">
                  <h2 className="text-lg text-red-600 font-semibold mb-4">Error</h2>
                  <p>{errorMessage}</p>
                  <div className="flex justify-around mt-4">
                      <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setErrorMessage('')}>
                          Close
                      </button>
                  </div>
              </div>
          </div>
          )}

          {confirmDeleteLogs && (
            <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white text-center rounded-lg shadow-lg p-5">
                <h5 className="mb-5">Are you sure you want to delete logs?</h5>
                <div className="flex justify-around">
                  <button className="h-10 w-24 bg-gray-500 rounded text-white" onClick={() => setConfirmDeleteLogs(false)}>Cancel</button>
                  <button className="h-10 w-24 bg-red-600 rounded text-white" onClick={() => handleDeleteLogs(selectedDeletedLogs)}>Confirm</button>
                </div>
              </div>
            </div>
          )}

          {deleteLogsSuccess && (
            <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white text-center rounded-lg shadow-lg p-5">
                <div className="flex flex-col items-center justify-center mb-5">
                <FaRegCircleCheck className="w-10 text-green-500 h-10"/>
                <h5>Delete Logs Success</h5>
                </div>
                <button onClick={() => setDeleteLogsSuccess(false)} className="w-24 h-10 bg-gray-500 rounded text-white">Close</button>
                </div>
              </div>
          )}

    </div>
  );
}