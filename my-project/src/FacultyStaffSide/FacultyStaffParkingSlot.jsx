/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsExclamationDiamond, BsExclamation, BsFillPersonVcardFill, BsQuestionSquare, BsTaxiFront, BsCreditCard2Front, BsFillSignNoParkingFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { FaRegCircleCheck} from "react-icons/fa6";
import URSLogo from '../Pictures/urs.png';
import FacultyMap from '../Pictures/facultymap.jpg';
import 'react-medium-image-zoom/dist/styles.css';

export default function FacultyStaffParkingSlot() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [popupImage, setPopupImage] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Initially null
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [alreadySelectSpot, setAlreadySelectSpot] = useState(false);
  const [occupiedSlot, setOccupiedSlot] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [otherVehicle, setOtherVehicle] = useState(false);
  const [slotSuccess, setSlotSuccess] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [occupiedSpots, setOccupiedSpots] = useState({
    motorcycle: [],
    fourwheeler: []
  });

  const [categories, setCategories] = useState({
    motorcycle: { count: 0, color: 'bg-green-500 text-white' },
    fourwheeler: { count: 0, color: 'bg-green-500 text-white' }
  });

  // Fetch vehicle counts from the backend API
  useEffect(() => {
    const fetchVehicleCounts = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/facultygetvehiclecount.php');
        const { motorcycle, tricycle, fourwheeler } = response.data;

        // Update the categories with the counts from the database
        setCategories(prevCategories => ({
          ...prevCategories,
          motorcycle: { ...prevCategories.motorcycle, count: motorcycle },
          fourwheeler: { ...prevCategories.fourwheeler, count: fourwheeler }
        }));
      } catch (error) {
        console.error('Error fetching vehicle counts:', error);
      }
    };

    fetchVehicleCounts();
  }, []);

  const toggleImage = () => {
    setPopupImage(!popupImage);
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/facultyfetchdata.php', {
          withCredentials: true
        });

        if (response.data.success) {
          const user = response.data.data;
          setUserData(user);

          // Normalize vehicle type to match keys in categories
          const vehicleType = user.Vehicle.toLowerCase();
          setSelectedVehicle(vehicleType);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
          navigate('/');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ' + error);
        navigate('/');
      }
    };

    const fetchOccupiedSlots = async () => {
      try {
        const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/facultyfetchoccupiedslot.php', {
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
        console.error('Error fetching occupied slots: ', error);
      }
    };

    fetchData();
    fetchOccupiedSlots();
  }, []);

  useEffect(() => {
    console.log('Occupied spots: ', occupiedSpots);
  }, [occupiedSpots]);

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

  const handleSpotSelection = (spotNumber) => {
    if (selectedVehicle !== userData.Vehicle.toLowerCase()) {
      setOtherVehicle(true);
      return;
    }
    setSelectedSpot(spotNumber);
  };

  const handleSubmit = async () => {
    if (selectedSpot === null || !userData || !userData.id) {
      alert('Please select a parking spot and ensure you are logged in');
      return;
    }
  
    if (userData.parkingSlot) {
      alert('You already have a selected parking slot.');
      return;
    }
  
    if (selectedVehicle !== userData.Vehicle.toLowerCase()) {
      alert(`Error: Your vehicle type is ${userData.Vehicle}. You cannot select a parking slot for a different vehicle type.`);
      return; // Prevent submission if vehicle type doesn't match
    }
  
    // Show the confirmation modal
    setShowConfirmationModal(true);
  };
  
  const handleConfirm = async () => {
    setShowConfirmationModal(false); // Hide the modal
  
    try {
      const response = await axios.post('https://skyblue-clam-769210.hostingersite.com/facultyselectparkingslot.php', {
        slotType: selectedVehicle,
        slotNumber: selectedSpot,
        id: userData.id
      });
  
      if (response.data.status === 'success') {
        setSlotSuccess(true);
        // Update local state
        setUserData(prevData => ({
          ...prevData,
          parkingSlot: { slotType: selectedVehicle, slotNumber: selectedSpot }
        }));
        setOccupiedSpots(prevOccupied => ({
          ...prevOccupied,
          [selectedVehicle]: [...(prevOccupied[selectedVehicle] || []), selectedSpot]
        }));
  
        // Store in localStorage
        localStorage.setItem('selectedParkingSlot', JSON.stringify({
          slotType: selectedVehicle,
          slotNumber: selectedSpot
        }));
      } else {
        setAlreadySelectSpot(true);
      }
    } catch (error) {
      console.error('Error selecting parking slot:', error);
      alert('Error selecting parking slot: ' + error.message);
    }
  };
  
  const handleCancel = () => {
    setShowConfirmationModal(false); // Hide the modal on cancel
  };  

  const renderSpots = (count, color, vehicleType) => {
    const occupied = occupiedSpots[vehicleType] || [];
    const currentUserSpot = userData.parkingSlot ? userData.parkingSlot.slotNumber : null;
    const currentUserVehicleType = userData.parkingSlot ? userData.parkingSlot.slotType : null;

    return Array.from({ length: count }, (_, index) => {
      const spotNumber = index + 1;
      const isOccupied = occupied.map(Number).includes(spotNumber);
      const isSelected = selectedSpot === spotNumber && selectedVehicle === vehicleType;
      const isCurrentUserSpot = currentUserSpot === spotNumber && currentUserVehicleType === vehicleType;


      let spotColorClass = '';
      if (isCurrentUserSpot) {
        spotColorClass = 'bg-orange-500';
      } else if (isSelected) {
        spotColorClass = 'bg-red-400';
      } else if (isOccupied) {
        spotColorClass = 'bg-red-600 cursor-not-allowed';
      } else {
        spotColorClass = 'bg-green-500';
      }

      return (
        <div key={index}
          className={`rounded-xl h-20 flex items-center justify-center cursor-pointer ${color} ${spotColorClass}`}
          style={{
            borderColor: isSelected || isOccupied ? '#E53E3E' : 'transparent',
            color: isSelected || isOccupied ? '#FFFFFF': '#000000',
            boxShadow: isSelected ? '0 0 0 2px rgba(66, 153, 225, 0.5)' : 'none'
          }}
          onClick={() => {
            if (!isOccupied && !isCurrentUserSpot) {
              handleSpotSelection(spotNumber);
            } else if (isOccupied) {
              setOccupiedSlot(true);
            }
          }}
        >
          {spotNumber}
        </div>
      );
    });
  };

  const ConfirmationModal = ({ onConfirm, onCancel, selectedSpot }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Confirm Selection
        </h2>
        <p>
          Are you sure you want to select Parking Spot No.{selectedSpot}?
        </p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  // Handle zoom in and out
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = Math.min(Math.max(scale + e.deltaY * -0.01, 1), 3); // Max zoom is 3x, min is 1x
    setScale(newScale);
  };

  // Handle image dragging (panning)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const x = e.clientX - startPosition.x;
      const y = e.clientY - startPosition.y;
      setTranslate({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  return(
    <>
      <div className="relative w-full h-screen bg-blue-700 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-40"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white z-30 rounded-r-2xl drop-shadow-2xl absolute inset-y-0 left-0 transform xl:w-1/5 lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
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
            <Link to="/facultystaffparkingslot" className="group no-underline h-14 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-lg text-white tracking-widest flex items-center w-full lg:text-base xl:text-lg ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/facultystaffaccount" className="group no-underline w-full h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-lg xl:text-lg ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/facultystaffabout" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-lg ml-5">
              <BsQuestionSquare /> <span className="ml-5">About</span>
              </li>
            </Link>
          </div>
          <button className="w-full bg-blue-900 h-14 text-red-600 font-semibold tracking-widest text-lg bg-white flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
          </nav>

        {/* Main Content */}
        <div className="w-full h-[90rem] bg-blue-700">
          <div className="w-full h-20 flex justify-end items-end border-b-2">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Parking Slot</p>
          </div>
          <div className="flex items-center p-3 flex-col sm:flex-row">
            <h3 className="text-white">Please select your prefered parking spot.</h3>
            <div className="flex">
              <div className="ml-3 h-6 w-20 bg-green-500 rounded flex justify-center items-center text-white">Available</div>
              <div className="ml-3 h-6 w-20 bg-red-600 rounded flex justify-center items-center text-white">Occupied</div>
            </div>
          </div>
          <div className="bg-blue-800 mx-auto p-4 h-5/6 overflow-auto border-2 rounded max-sm:w-9/10">
            <div className="mb-4">
              <label className="mr-4 text-white">Select Vehicle Type:</label>
              <select
                value={selectedVehicle}
                onChange={(e) => {
                  setSelectedVehicle(e.target.value);
                  setSelectedSpot(null); // Reset selected spot on vehicle type change
                }}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="motorcycle">Motorcycle</option>
                <option value="fourwheeler">Four Wheeler</option>
              </select>
              {selectedVehicle === 'fourwheeler' && (
                <div className="font-semibold text-sm mt-2 flex items-center text-gray-400">
                  <BsExclamationDiamond className="mr-2 text-red-500" />
                  <span className="text-red-500">Notice: &nbsp;</span>
                  <span>The Parking Slots of Four Wheeler is located at the front of the Engineering Building.</span>
                </div>
              )}
            </div>
            <button onClick={() => setPopupImage(true)} className="p-2 bg-yellow-500 rounded text-white">Vicinity Map</button>
            {Object.entries(categories).map(([category, { count, color }]) =>
              selectedVehicle === category ? (
                <div key={category} className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-white">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {selectedSpot !== null && (
                      <div className="bottom-12 fixed right-8 sm:right-16 bottom-10">
                        <button
                          onClick={handleSubmit}
                          className="p-2 bg-blue-500 text-white rounded"
                        >
                          Confirm Selection
                        </button>
                      </div>
                    )}
                  </h2>
                  <div className="grid grid-cols-1 max-sm:grid-cols-3 max-md:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    {renderSpots(count, color, category)}
                  </div>
                </div>
              ) : null
            )}
          </div>
          {popupImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="relative rounded-lg w-full h-auto sm:w-3/6 sm:h-3/6 rounded zoom-container">
              <button onClick={() => setPopupImage(false)} className="z-20 absolute right-5 top-2 text-white bg-gray-500 p-2 rounded">Close</button>
              <img
                src={FacultyMap}
                alt="Vicinity Map"
                ref={imageRef}
                className="zoomable-image"
                style={{
                  transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // Stop dragging if cursor leaves the image
              />
            </div>
          </div>
          )}

        {alreadySelectSpot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
            <div className="bg-white h-60 flex flex-col justify-around p-6 rounded-lg shadow-lg">
              <div className="w-full flex justify-center">
                <BsFillSignNoParkingFill className="w-12 h-12 text-red-600"/>
              </div>
              <p>You already have a selected parking slot.</p>
              <button onClick={() => setAlreadySelectSpot(false)}>Close</button>
            </div>
          </div>
        )}

        {occupiedSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white h-60 flex flex-col justify-around p-6 rounded-lg shadow-lg">
            <div className="w-full flex justify-center">
              <BsFillSignNoParkingFill className="w-12 h-12 text-red-600"/>
            </div>
            <p>This parking slot is already occupied.</p>
            <button onClick={() => setOccupiedSlot(false)}>Close</button>
          </div>
        </div>
        )}

        {showConfirmationModal && (
          <ConfirmationModal
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            selectedSpot={selectedSpot}
          />
        )}

        {otherVehicle && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white h-60 flex flex-col justify-around p-6 rounded-lg shadow-lg">
            <div className="w-full flex justify-center">
              <BsExclamation className="w-10 h-10 text-red-600"/>
            </div>
            <p>{`Your registered vehicle type is ${userData.Vehicle}. Please select a parking slot matching your vehicle type.`}</p>
            <button onClick={() => setOtherVehicle(false)}>Close</button>
          </div>
          </div>
        )}

        {slotSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
            <div className="bg-white h-60 flex flex-col justify-around p-6 rounded-lg shadow-lg">
              <div className="w-full flex justify-center">
                <FaRegCircleCheck className="w-10 h-10 text-green-500"/>
              </div>
              <p>Parking slot selected successfully.</p>
              <button onClick={() => setSlotSuccess(false)}>Close</button>
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
        </div>
      </div>
    </>
  );
}