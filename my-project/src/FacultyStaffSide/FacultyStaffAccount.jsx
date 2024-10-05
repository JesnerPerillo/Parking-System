/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCreditCard2Front } from "react-icons/bs";
import { BsTaxiFront } from "react-icons/bs";
import { BsExclamationTriangle } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { BsPersonFillGear } from "react-icons/bs";
import QRCode from "qrcode.react";
import URSLogo from '../Pictures/urs.png';
import GSO from '../Pictures/gsoo.png'
import { IoEyeOff, IoEye  } from "react-icons/io5";

export default function FacultyStaffAccount() {
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [licenseSrc, setLicenseSrc] = useState('');
  const [orcrSrc, setOrcrSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [slot, setSlot] = useState([]);
  const canvasRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    fullname: '',
    email: '',
    position: '',
    building: '',
    password: '',
    license: null,
    orcr: null
  });

  const togglePassword =() => {
    setShowPassword(!showPassword);
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/facultyedituser.php', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if (response.data.success) {
        // Update the user data with the returned data from the backend
        setUserData((prev) => ({
          ...prev,
          ...response.data.userData, // Use the updated user data from the backend
          password: '', // Don't include the password in the UI state
        }));
        
        alert('Account updated successfully');
        setIsEditModalOpen(false); // Close the modal after success
      } else {
        alert('Error updating account: ' + (response.data.message || 'Unknown error'));
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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    axios.get('https://skyblue-clam-769210.hostingersite.com/facultyfetchdata.php', { withCredentials: true })
      .then(response => {
        console.log('Fetched user data:', response.data); // Log the response
        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          console.log(response.data.message);
          navigate('/');
        }
      })
      .catch(error => {
        console.log('Error fetching user data:', error);
        navigate('/');
      });
  }, []);
  
  useEffect(() => {
    const fetchImage = async (type) => {
      try {
        const response = await axios.get(`https://skyblue-clam-769210.hostingersite.com/facultyfetchimage.php?type=${type}`, {
          responseType: 'blob',
          withCredentials: true
        });
        const imageUrl = URL.createObjectURL(response.data);
        if (type === 'License') {
          setLicenseSrc(imageUrl);
        } else if (type === 'ORCR') {
          setOrcrSrc(imageUrl);
        }
      } catch (error) {
        console.error(`Error fetching ${type} image:`, error);
      }
    };
  
    fetchImage('License');
    fetchImage('ORCR');
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/logout.php', {
        withCredentials: true,
      });

      console.log('Logout response:', response.data);

      if (response.data.success) {
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Error logging out: ' + error.message);
      console.error('Error logging out: ', error);
    }
  };

  useEffect(() => {
    const fetchFacultyParkingSlots = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/fetchfacultyparkingslots.php', {
          withCredentials: true // Send cookies with the request if needed
        });
  
        if (response.data.status === 'success') {
          setSlot(response.data.data); // Set parking slot state
        } else {
          setError(response.data.message || 'Failed to fetch parking slots.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data:', error);
      }
    };
  
    fetchFacultyParkingSlots();
  }, []);
  

  const qrValue = slot.length ? slot.map((s) => `${s.slot_type}:${s.slot_number}`).join(',') : '';



const handleDownloadQRCode = () => {
  console.log('Button clicked');
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = 400;
  canvas.height = 400;

  // Fill background with white color
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const logoImg = new Image();
  logoImg.src = URSLogo;

  logoImg.onload = () => {
    console.log('Logo loaded successfully');
    
    // Draw the logo
    const logoWidth = 70;
    const logoHeight = 75;
    const logoX = 25; // X coordinate for logo
    const logoY = 25; // Y coordinate for logo
    context.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    
    // Draw the QR code
    const qrCanvas = canvasRef.current.querySelector('canvas');
    if (qrCanvas) {
      console.log('QR Canvas found');
      const qrWidth = 200;
      const qrHeight = 200;
      const qrX = (canvas.width - qrWidth) / 2; // Center the QR code horizontally
      const qrY = logoY + logoHeight + 10; // Position below the logo
      context.drawImage(qrCanvas, qrX, qrY, qrWidth, qrHeight);
    } else {
      console.error('QR Canvas not found');
    }
    
    // Draw the text beside the logo
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.fillStyle = 'black';
    const textX = logoX + logoWidth + 10; // X coordinate for text (to the right of the logo)
    const textY = logoY + (logoHeight / 2); // Center text vertically relative to the logo
    context.fillText('URS MORONG CAMPUS', textX, textY);

    // Draw the user's name at the bottom of the canvas
    context.font = '16px Arial';
    context.textAlign = 'center';
    const userName = userData.Name || 'User'; // Fallback in case userData.Name is undefined
    context.fillText(userName, canvas.width / 2, canvas.height - 30); // Position 30px from the bottom

    // Create and download the image
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'parking_qrcode.png';
    link.click();
  };

  logoImg.onerror = () => {
    console.error('Failed to load logo image');
  };
};



  return(
    <>
      <div className="relative w-full h-screen bg-blue-700 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white rounded-r-2xl drop-shadow-2xl absolute inset-y-0 left-0 transform xl:w-1/5 lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
            <div className=" w-full h-44 text-blue-700 flex flex-col items-center justify-between text-xl tracking-wider">
                <img src={URSLogo} className="w-20 h-26" />
                <h1 className="text-2xl tracking-widest lg:text-sm xl:text-2xl">PARKING SYSTEM</h1>
              </div>
            <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/facultystaffdashboard" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/facultystaffparkingslot" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-base xl:text-lg ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/facultystaffaccount" className="group no-underline w-full h-14 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-lg xl:text-lg ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/facultystaffabout" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-lg ml-5">
              <BsQuestionSquare /> <span className="ml-5">About</span>
              </li>
            </Link>
          </div>
          <button className="w-full bg-blue-900 h-14 text-red-600 font-semibold tracking-widest text-lg bg-white flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
          </nav>

        {/*Main Content */}
        <div className="w-full min-h-screen">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">
              {isNavOpen ? '' : 'Account'}
            </p>
          </div>

          {!isNavOpen && (
            <>
            <div className="w-full h-auto flex justify-center mt-5">
              <div className="w-5/6 h-[78rem] max-h-full bg-white rounded-xl flex flex-col justify-start sm:h-[35rem] sm:flex-col sm:justify-between items-center p-4">
              <div className="flex w-full flex-col sm:flex-row">
                <div
                  ref={canvasRef}
                  className="w-full bg-white shadow-2xl m-2 rounded sm:w-40 h-32 flex flex-col justify-center items-center"
                >
                  <div className="">
                    <QRCode value={qrValue} size={100} includeMargin={true} />
                  </div>
                </div>
                <div className="flex h-full flex-col justify-around">
                  <button
                      onClick={handleDownloadQRCode}
                      className="bg-gray-500 text-white p-2 rounded"
                    >
                      Download QR Code
                    </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Account
                  </button>
                </div>
              </div>
              <div className="w-full flex p-2 h-auto overflow-auto flex-col sm:w-full sm:flex-row justify-between h-full text-sm">
                <div className="w-full p-3 rounded bg-white drop-shadow-lg sm:w-2/5 ">
                  <p className="mb-4 mt-5 text-2xl sm:text-3xl font-bold">
                    {userData.Name}
                  </p>
                  <p className="mb-2 border-t-2 w-full border-gray-200 sm:w-2/3">Employee Id Number: {userData['Employee Id']}</p>
                  <p className="mb-2">Email: {userData.Email}</p>
                  <p className="mb-2">Position: {userData.Position}</p>
                  <p className="mb-2">Building: {userData.Building}</p>
                  <p className="mb-2">Vehicle: {userData.Vehicle}</p>
                  <p className="mb-2">Plate Number: {userData['Plate Number']}</p>
                  {slot.map((s) => (
                    <p key={s.slot_id}>Parking Slot: {s.slot_number}</p>
                  ))}
                </div>
                <div className="relative rounded bg-white p-2 drop-shadow-lg w-full h-full flex flex-col overflow-y-auto sm:w-1/2 sm:flex-row sm:items-end">
                  <h4 className="absolute top-20">Documents</h4>
                  <div className="mb-4 w-full sm:w-1/3">
                    <b>License:</b>
                    <br />
                    {licenseSrc ? (
                      <div className="relative w-full h-40 md:w-40 md:h-32 group">
                        {/* Dark background overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition duration-300 ease-in-out z-10"></div>

                        {/* Image */}
                        <img
                          src={licenseSrc}
                          alt="License"
                          className="w-full h-full object-cover z-0"
                        />

                        {/* Eye icon in the center */}
                        <button
                          onClick={() => handleOpenModal(licenseSrc)}
                          className="absolute inset-0 flex items-center justify-center text-white hover:text-blue-700 z-20"
                          aria-label="View License"
                        >
                          <BsEyeFill className="w-6 h-6" />
                        </button>
                      </div>
                    ) : (
                      'No image available'
                    )}
                  </div>

                  <div className="mb-4 w-full sm:w-1/3">
                    <b>ORCR:</b>
                    <br />
                    {orcrSrc ? (
                      <div className="relative w-full h-40 md:w-40 md:h-32 group">
                        {/* Dark background overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition duration-300 ease-in-out z-10"></div>

                        {/* Image */}
                        <img
                          src={orcrSrc}
                          alt="ORCR"
                          className="w-full h-full object-cover z-0"
                        />

                        {/* Eye icon in the center */}
                        <button
                          onClick={() => handleOpenModal(orcrSrc)}
                          className="absolute inset-0 flex items-center justify-center text-white hover:text-blue-700 z-20"
                          aria-label="View ORCR"
                        >
                          <BsEyeFill className="w-6 h-6" />
                        </button>
                      </div>
                    ) : (
                      'No image available'
                    )}
                  </div>
                </div>
                
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white p-1 rounded-lg shadow-lg flex justify-center w-full h-auto sm:w-3/4 h-3/4">
                    <button onClick={handleCloseModal} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <img src={modalImageSrc} alt="Enlarged" className="max-w-full max-h-full" />
                  </div>
                </div>
              )}

              {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 sm:">
                <div className="bg-opacity-50 w-2/4 p-2 flex justify-center items-center rounded-lg max-sm:h-full w-full overflow-auto">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col w-full gap-3 float:right h-auto max-w-3xl p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
                <p className="text-3xl font-semibold tracking-tight relative flex items-center justify-center text-cyan-500 sm:text-2xl max-sm:text-base">
                  <BsPersonFillGear className="mr-5 w-10"/> Edit Account
                </p>
                <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                  <label className="relative w-full">
                    <input name="employeeId" value={formData.employeeId}  onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder="" required disabled/>
                    <span className="text-red-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">{userData[`Employee Id`]} <BsExclamationTriangle className="absolute left-20 top-1/2 transform -translate-y-1/2 text-gray-500" /></span>
                  </label>
                  <label className="relative w-full">
                    <input name="fullname" value={formData.fullname} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                    <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">FullName</span>
                  </label>
                </div>
                <label className="relative">
                  <input name="email" value={formData.email} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="email" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Email</span>
                </label>
                <label className="relative">
                  <input name="position" value={formData.position} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Position</span>
                </label>
                <label className="relative">
                  <input name="building" value={formData.building} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Building</span>
                </label>
                <label className="relative">
                  <input name="password" value={formData.password} onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type={showPassword ? 'text' : 'password'} placeholder=" " required />
                  <span className="text-gray-500 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Password</span>
                  <button
                  type="button"
                    onClick={togglePassword}
                    className="absolute right-5 top-4">
                    {showPassword ? <IoEyeOff className="w-6 h-6"/> : <IoEye className="w-6 h-6"/>}
                  </button>
                </label>
                <div>
                  <label for="formFile" class="form-label">License</label>
                  <input name="license" onChange={handleFileChange} class="form-control" type="file" id="formFile" />
                </div>
                <div>
                  <label for="formFile1" class="form-label">ORCR</label>
                  <input name="orcr" onChange={handleFileChange} class="form-control" type="file" id="formFile1" />
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
              </div>
              )}
              </div>
            </div>
          </div>
        </>)}

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
      </div>
      </div>
    </>
  )
}