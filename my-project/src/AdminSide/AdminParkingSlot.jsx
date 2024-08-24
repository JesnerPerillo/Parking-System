/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsTaxiFront, BsCreditCard2Front, BsFillPersonVcardFill, BsQuestionSquare } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsEyeFill } from "react-icons/bs";

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
            // Set the License and ORCR image sources
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
      <div className="w-full h-screen">
        <div className="w-full h-20 flex justify-end items-end border-b-2">
          <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Parking Slots</p>
        </div>
        <div className="container bg-blue-900 mx-auto p-4 h-4/5 overflow-auto mt-20 border-2 rounded">
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
      </div>

      {/* Pop-up for showing user data */}
      {popupData && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-2/5">
              <h2 className="text-2xl font-semibold mb-4">Slot User Information</h2>
              <div>
                {selectedUserType === 'student' ? (
                  <div>
                    <p><strong>Student Number:</strong> {popupData['Student Number']}</p>
                    <p><strong>Name:</strong> {popupData.Name}</p>
                    <p><strong>Email:</strong> {popupData.Email}</p>
                    <p><strong>Vehicle:</strong> {popupData.Vehicle}</p>
                    <p><strong>Plate Number:</strong> {popupData['Plate Number']}</p>
                    <p><strong>Slot Number:</strong> {popupData.slot_number}</p>
                  </div>
                ) : (
                  <div>
                    <p><strong>Name:</strong> {popupData.Name}</p>
                    <p><strong>Email:</strong> {popupData.Email}</p>
                    <p><strong>Position:</strong> {popupData.Position}</p>
                    <p><strong>Building:</strong> {popupData.Building}</p>
                    <p><strong>Vehicle:</strong> {popupData.Vehicle}</p>
                    <p><strong>Plate Number:</strong> {popupData['Plate Number']}</p>
                    <p><strong>Slot Number:</strong> {popupData.slot_number}</p>
                  </div>
                )}
                <div className="w-full flex justify-around">
                  {licenseSrc ? (
                    <div className="flex flex-col">
                      <p>License</p>
                      <div className="flex">
                        <img src={licenseSrc} alt="License" className="w-40 h-32 inline-block max-sm:w-24" />
                        <button onClick={() => handleOpenModal(licenseSrc)} className="ml-2 text-blue-500 hover:text-blue-700">
                          <BsEyeFill className="w-10 h-7"/>
                        </button>
                      </div>
                    </div>
                  ) : 'No License image available'}
                  {orcrSrc ? (
                    <div className="flex flex-col">
                      <p>ORCR</p>
                      <div className="flex">
                        <img src={orcrSrc} alt="ORCR" className="w-40 h-32 inline-block max-sm:w-24" />
                        <button onClick={() => handleOpenModal(orcrSrc)} className="ml-2 text-blue-500 hover:text-blue-700">
                          <BsEyeFill className="w-10 h-7"/>
                        </button>
                      </div>
                    </div>
                  ) : 'No image available'}
                </div>

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
              </div>
              <div className="w-full flex justify-between">
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
                  onClick={() => setPopupData(null)}
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
