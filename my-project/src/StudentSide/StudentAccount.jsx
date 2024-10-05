/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare, BsPersonFillGear, BsEyeFill, BsFillPersonVcardFill, BsExclamationTriangle, BsCreditCard2Front, BsTaxiFront } from "react-icons/bs";
import QRCode from "qrcode.react";
import URSLogo from '../Pictures/urs.png';
import GSO from '../Pictures/gsoo.png'
import { IoEyeOff, IoEye  } from "react-icons/io5";

export default function StudentAccount() {
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [licenseSrc, setLicenseSrc] = useState('');
  const [orcrSrc, setOrcrSrc] = useState('');
  const [corSrc, setCorSrc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [slot, setSlot] = useState([]);
  const canvasRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [formData, setFormData] = useState({
    studentNumber: '',
    fullname: '',
    email: '',
    yearsection: '',
    course: '',
    password: '',
    license: null,
    orcr: null,
    cor: null,
  });

  const togglePassword = () => {
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
      const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/edituser.php', form, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.success) {
        // Directly update the user data state with the form data
        setUserData((prev) => ({
          ...prev,
          ...formData,
          password: '', // Ensure password is not reflected in the user state
        }));
        
        alert('Account updated successfully');
        setIsEditModalOpen(false); // Close the modal after success
        alert('Please download the new qr code after the modification on your data.');
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

  useEffect(() => {
    axios.get('https://skyblue-clam-769210.hostingersite.com/fetchdata.php', { withCredentials: true })
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
        const response = await axios.get(`https://skyblue-clam-769210.hostingersite.com/fetchimage.php?type=${type}`, {
          responseType: 'blob',
          withCredentials: true
        });
        const imageUrl = URL.createObjectURL(response.data);
        if (type === 'License') {
          setLicenseSrc(imageUrl);
        } else if (type === 'ORCR') {
          setOrcrSrc(imageUrl);
        } else if (type === 'COR') {
          setCorSrc(imageUrl);
        }
      } catch (error) {
        console.error(`Error fetching ${type} image:`, error);
      }
    };
  
    fetchImage('License');
    fetchImage('ORCR');
    fetchImage('COR');
  }, []);
  

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/logout.php', {
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

  const handleEditChange = async (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value});
  };

  useEffect(() => {
    const fetchStudentParkingSlots = async () => {
      try {
        const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/fetchstudentparkingslots.php', {
          withCredentials: true // Send cookies with the request if needed
        });

        if (response.data.status === 'success') {
          setSlot(response.data.data); // Set parking slots state
        } else {
          setError(response.data.message || 'Failed to fetch parking slots.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data:', error);
      }
    };
  
    fetchStudentParkingSlots();
  }, []);
  

  const qrValue = slot.length
  ? slot.map((s) => `${s.slot_type}:${s.slot_number}`).join(',')
  : '';



  const handleDownloadQRCode = () => {
    console.log('BUtton Clicked');

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const logoImg = new Image();
    logoImg.src = URSLogo;

    logoImg.onload = () => {
      console.log('Logo loaded successfully');

      const logoWidth = 70;
      const logoHeight = 75;
      const logoX = 25;
      const logoY = 25;
      context.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

      const qrCanvas = canvasRef.current.querySelector('canvas');
      if (qrCanvas) {
        console.log('QR Canvas found');
        const qrWidth = 200;
        const qrHeight = 200;
        const qrX = (canvas.width - qrWidth) / 2;
        const qrY = logoY + logoHeight + 10;
        context.drawImage(qrCanvas, qrX, qrY, qrWidth, qrHeight);
      } else {
        console.error('QR Canvas no found');
      }

      context.font = '20px Arial';
      context.textAlign = 'left';
      context.fillStyle = 'black';
      const textX = logoX + logoWidth + 10;
      const textY = logoY + (logoHeight / 2);
      context.fillText('URS MORONG CAMPUS', textX, textY);

      context.font = '16px Arial';
      context.textAlign = 'center';
      const userName = userData.Name || 'User';
      context.fillText(userName, canvas.width / 2, canvas.height - 30);

      const dataURL = canvas.toDataURL('img/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'parking_qrcode.png';
      link.click();
    };

    logoImg.onerror = () => {
      console.error('Failed to load logo image');
    };
  };
  

  return (
    <>
      <div className="relative w-full lg:h-screen bg-blue-700 flex">
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
            <Link to="/studentdashboard" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/studentparkingslot" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-base xl:text-lg ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/studentaccount" className="group no-underline w-full h-14 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-lg xl:text-lg ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/studentabout" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-lg ml-5">
              <BsQuestionSquare /> <span className="ml-5">About</span>
              </li>
            </Link>
          </div>
          <button className="w-full bg-blue-900 h-14 text-red-600 font-semibold tracking-widest text-lg bg-white flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
          </nav>

        {/*Main Content*/}
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
                  <p className="mb-2 border-t-2 w-full border-gray-200 sm:w-2/3">Student Number: {userData['Student Number']}</p>
                  <p className="mb-2">Email: {userData.Email}</p>
                  <p className="mb-2">Year & Section: {userData['Year and Section']}</p>
                  <p className="mb-2">Course: {userData.Course}</p>
                  <p className="mb-2">Vehicle: {userData.Vehicle}</p>
                  <p>Plate Number: {userData['Plate Number']}</p>
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

                  <div className="mb-4 w-full sm:w-1/3">
                    <b>COR:</b>
                    <br />
                    {corSrc ? (
                      <div className="relative w-full h-40 md:w-40 md:h-32 group">
                        {/* Dark background overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition duration-300 ease-in-out z-10"></div>

                        {/* Image */}
                        <img
                          src={corSrc}
                          alt="COR"
                          className="w-full h-full object-cover z-0"
                        />

                        {/* Eye icon in the center */}
                        <button
                          onClick={() => handleOpenModal(corSrc)}
                          className="absolute inset-0 flex items-center justify-center text-white hover:text-blue-700 z-20"
                          aria-label="View COR"
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
                  <div className="fixed inset-0 w-full z-30 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-white p-1 rounded-lg shadow-lg flex justify-center w-full h-2/4 max-h-screen sm:w-3/4 sm:h-2/3">
                      <button
                        onClick={handleCloseModal}
                        className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <img
                        src={modalImageSrc}
                        alt="Enlarged"
                        className="max-w-full max-h-full"
                      />
                    </div>
                  </div>
                )}

                  {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 max-sm:w-full">
                    <div className="bg-opacity-50 p-2 rounded-lg max-sm:h-full max-sm:w-full overflow-auto">
                      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col w-full gap-3 float:right h-auto max-w-3xl p-6 rounded-2xl relative bg-gray-900 text-white border border-gray-700 max-sm:w-full sm:p-5">
                          <p className="text-3xl font-semibold tracking-tight relative flex items-center justify-center text-cyan-500 sm:text-2xl max-sm:text-base">
                          <BsPersonFillGear className="mr-5 w-10"/> Edit Account
                          </p>
                        <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-1">
                          <label className="relative w-full">
                            <input name="studentNumber" value={formData.studentNumber}  onChange={handleChange} className="bg-gray-800 text-white w-full py-3 px-3.5 outline-none border border-gray-600 rounded-md peer sm:py-2 sm:px-2.5" type="text" placeholder="" required disabled/>
                            <span className="text-red-400 absolute left-3.5 top-3 transform -translate-y-1/2 transition-all duration-300 ease peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs peer-focus:text-cyan-500 sm:left-2.5 sm:text-xs">Student Number: {userData[`Student Number`]} <BsExclamationTriangle className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500" /></span>
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
                        </div>
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
                          <input name="license" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
                        </div>
                        <div>
                          <label for="formFile" class="form-label">ORCR</label>
                          <input name="orcr" class="form-control" type="file" id="formFile" onChange={handleFileChange}/>
                        </div>
                        <div>
                          <label for="formFile" class="form-label">COR (Certificate of Registration)</label>
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
  );
}
