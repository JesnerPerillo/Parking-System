/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCreditCard2Front } from "react-icons/bs";
import { BsTaxiFront } from "react-icons/bs";
import { BsExclamationDiamond } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { BsPersonFillGear } from "react-icons/bs";
import QRCode from "qrcode.react";
import logo from '../Pictures/urs.png';


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
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    position: '',
    building: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost/website/my-project/Backend/facultyedituser.php', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Update user data state
        setUserData((prev) => ({
          ...prev,
          ...formData,
          password: '', // Don't show the password in user data
        }));
        alert('Account updated successfully');
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

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/facultyfetchdata.php', {
          withCredentials: true
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchImage = async (type) => {
      try {
        const response = await axios.get(`http://localhost/website/my-project/Backend/facultyfetchimage.php?type=${type}`, {
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
      const response = await axios.get('http://localhost/website/my-project/Backend/logout.php', {
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
        const response = await axios.get('http://localhost/website/my-project/Backend/fetchfacultyparkingslots.php', {
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
  

  const qrValue = slot.length ? `
|  F A C U L T Y   I N F O  |

---------------------------------------

NAME:                                ${userData.Name}

EMAIL:                                ${userData.Email}

POSITION:                ${userData.Position}

BUILDING:                            ${userData.Building}

VEHICLE:                           ${userData.Vehicle}

PLATE NUMBER:              ${userData['Plate Number']}

SLOT NUMBER:                 ${slot.map((s) => s.slot_number).join(', ')}

`.trim() : '';



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
  logoImg.src = logo;

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
      <div className="relative w-full h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full fixed top-4 left-4 z-50"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
        <div className="border-b-2 border-blue-900 w-full h-24 text-blue-900 flex flex-col items-center justify-center mt-10 text-xl tracking-wider">
            <h1 className="text-bold text-3xl tracking-widest lg:text-xl xl:text-2xl 2xl:text-4xl">PARKING SYSTEM</h1>
          </div>
          <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/facultystaffdashboard" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/facultystaffparkingslot" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/facultystaffreport" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3" href="">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsExclamationDiamond /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/facultystaffaccount" className="group no-underline w-full h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 bg-blue-900 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/gsoabout" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsQuestionSquare /> <span className="ml-5">About</span>
              </li>
            </Link>
          </div>
          <button className="w-3/4 h-14 rounded-xl text-red-600 border border-red-500 font-semibold tracking-widest text-2xl bg-white flex items-center justify-center hover:bg-red-600" onClick={handleLogout}>
            <span className="hover:text-white hover:bg-red-600 rounded-xl flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180"/>Logout</span>
          </button>
        </nav>

        {/*Main Content */}
        <div className="w-full h-screen">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">{isNavOpen ? '' : 'Account'}</p>
          </div>
          {isNavOpen ? '' : <div className="lg:w-11/12 bg-blue-900 flex items-start mt-10 justify-center lg:h-3/4 relative lg:ml-16 rounded-xl max-sm:w-full border max-sm:h-9/10 max-md:h-3/5 w-full">
            <h1 className="text-white mt-10 max-sm:mt-5">
              FACULTY | STAFF ACCOUNT
            </h1>
            <div className="h-5/6 w-full absolute bottom-0 bg-white rounded-xl overflow-auto flex max-sm:flex-col justify-between max-sm:overflow-auto">
              <div ref={canvasRef} className="w-1/5 bg-gray-200 h-full xl:mt-0 max-sm:w-full mt-20 h-full flex flex-col justify-center items-center">
                <div className="mt-5 max-sm:mt-0">
                <QRCode value={qrValue} size={200} includeMargine=
                {true}/>
                </div>

                <button onClick={handleDownloadQRCode} className="mt-5 bg-gray-500 text-white p-2 rounded ">
                  Download QR Code
                </button>
              </div>
              <ul className="h-auto w-4/5 bg-red-500 flex flex-col justify-between max-sm:h-full">
                <li className="mb-4 mt-4 text-6xl max-sm:mt-0 mb-0 font-bold"> {userData.Name}</li>
                <li className="max-sm:text-xs mb-2">Email: {userData.Email}</li>
                <li className="max-sm:text-xs mb-2">Position: {userData.Position}</li>
                <li className="max-sm:text-xs mb-2">Building: {userData.Building}</li>
                <li className="max-sm:text-xs mb-2">Vehicle: {userData.Vehicle}</li>
                <li className="max-sm:text-xs">Plate Number: {userData['Plate Number']}</li>
                {slot.map((s) => (
                  <li key={s.slot_id} className="max-sm:text-xs">Parking Slot: {s.slot_number}</li>
                ))}
                <div className="mt-10 flex flex-col">
                <div>
                    <b>License:</b><br />
                    {licenseSrc ? (
                      <div className=" flex">
                        <img src={licenseSrc} alt="License" className="w-32 h-auto inline-block max-sm:w-24" />
                        <button onClick={() => handleOpenModal(licenseSrc)} className="ml-2 text-blue-500 hover:text-blue-700">
                          <BsEyeFill className="w-10 h-7"/>
                        </button>
                      </div>
                    ) : 'No image available'}
                  </div>
                  <li className="">
                    <b>ORCR:</b><br />
                    {orcrSrc ? (
                      <div className="flex">
                        <img src={orcrSrc} alt="ORCR" className="w-32 h-auto inline-block max-sm:w-24" />
                        <button onClick={() => handleOpenModal(orcrSrc)} className="ml-2 text-blue-500 hover:text-blue-700 ">
                          <BsEyeFill className="w-10 h-7"/>
                        </button>
                      </div>
                    ) : 'No image available'}
                  </li>

                  {//This is to Enlarge the image.
                  }
                  {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="relative bg-white p-4 rounded-lg shadow-lg flex justify-center w-3/4 h-3/4 max-sm:h-1/3 max-sm:w-full">
                        <button onClick={handleCloseModal} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <img src={modalImageSrc} alt="Enlarged" className="max-w-full max-h-full max-sm:w-full" />
                      </div>
                    </div>
                  )}

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 mb-3 w-44 max-sm:ml-7">
                  Edit Account
                </button>

                  {isEditModalOpen ? (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 sm:">
                      <div className="bg-opacity-50 w-2/4 p-8 flex justify-center items-center rounded-lg max-sm:h-full w-full overflow-auto">
                      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col w-full gap-3 float:right h-auto max-w-3xl p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
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
                          <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="placeholder:text-gray-400 w-full bg-gray-800 text-white py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" required>
                          <option value="" disabled  hidden>Type of Vehicle</option>
                            <option>Motorcycle</option>
                            <option>Tricycle</option>
                            <option>Fourwheeler</option>
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
                  ) : ''}
                </div>
              </ul>
              
            </div>
          </div>}
        </div>
      </div>
    </>
  )
}