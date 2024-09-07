/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCreditCard2Front, BsArrowRight } from "react-icons/bs";
import { BsTaxiFront } from "react-icons/bs";
import { BsExclamationDiamond } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";

export default function FacultyStaffParkingSlot() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null); // Initially null
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [occupiedSpots, setOccupiedSpots] = useState({
    motorcycle: [],
    tricycle: [],
    fourwheeler: []
  });

  const categories = {
    motorcycle: { count: 110, color: 'bg-green-500 text-white' },
    tricycle: { count: 15, color: 'bg-green-500 text-white' },
    fourwheeler: { count: 25, color: 'bg-green-500 text-white' }
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
          const user = response.data.data;
          setUserData(user);

          // Normalize vehicle type to match keys in categories
          const vehicleType = user.Vehicle.toLowerCase();
          setSelectedVehicle(vehicleType);

          console.log('User Data:', user);
          console.log('Vehicle Type:', vehicleType);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ' + error)
      }
    };

    const fetchOccupiedSlots = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/facultyfetchoccupiedslot.php', {
          withCredentials: true
        });

        if (response.data.status === 'success') {
          setOccupiedSpots(response.data.data || {
            motorcycle: [],
            tricycle: [],
            fourwheeler: []
          });
          console.log("Occupied slots fetched: ", response.data.data);
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

  const handleSpotSelection = (spotNumber) => {
    if (selectedVehicle !== userData.Vehicle.toLowerCase()) {
      alert(`Warning: Your Registered vehicle type is ${userData.Vehicle}. Please select a parking slot matching your vehicle type.`);
      return;
    }
    setSelectedSpot(spotNumber);
  };

  const handleSubmit = async () => {
    if (selectedSpot === null || !userData || !userData.id) {
      alert('Please select a parking slot and ensure you are logged in.');
      return
    }

    if (userData.parkingSlot) {
      alert('You already have a selected parking slot.');
      return;
    }

    if (selectedVehicle !== userData.Vehicle.toLowerCase()) {
      alert(`Error: Your vehicle type is ${userData.Vehicle}. You cannot select a parking slot for a different vehicle type.`);
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to select Parking Spot No.${selectedSpot}?`);
    if (!confirmed) {
      return;
    }

      try {
        const response = await axios.post('http://localhost/website/my-project/Backend/facultyselectparkingslot.php', {
          slotType: selectedVehicle,
          slotNumber: selectedSpot,
          id: userData.id
        });

        if (response.data.status === 'success') {
          alert('Parking slot selected successfully.');
          setUserData(prevData => ({
            ...prevData,
            parkingSlot: { slotType: selectedVehicle, slotNumber: selectedSpot }
          }));
          setOccupiedSpots(prevOccupied => ({
            ...prevOccupied,
            [selectedVehicle]: [...(prevOccupied[selectedVehicle] || []), selectedSpot]
          }));

          localStorage.setItem('selectedParkingSlot', JSON.stringify({
            slotType: selectedVehicle,
            slotNumber: selectedSpot,
          }));
        } else {
          alert('Error selecting parking slot: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error selecting parking slot: ', error);
        alert('Error selecting parking slot: ', error.message);
      }
    };

  const renderSpots = (count, color, vehicleType) => {
    const occupied = occupiedSpots[vehicleType] || [];
    const currentUserSpot = userData.parkingSlot ? userData.parkingSlot.slotNumber : null;
    const currentUserVehicleType = userData.parkingSlot ? userData.parkingSlot.slotType : null;

    console.log(`Rendering spots for ${vehicleType}`);
    console.log('Occupied Spots: ', occupied);
    console.log('Current UserSpot: ', currentUserSpot, 'Current User Vehicle Type: ', currentUserVehicleType);

    return Array.from({ length: count }, (_, index) => {
      const spotNumber = index + 1;
      const isOccupied = occupied.map(Number).includes(spotNumber);
      const isSelected = selectedSpot === spotNumber && selectedVehicle === vehicleType;
      const isCurrentUserSpot = currentUserSpot === spotNumber && currentUserVehicleType === vehicleType;

      console.log(`Spot ${spotNumber}: isOccupied=${isOccupied}, isSelected=${isSelected}, isCurrentUserSpot=${isCurrentUserSpot}`);

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
            color: isSelected || isOccupied ? '#FFFFFF' : '#000000',
            boxShadow: isSelected ? '0 0 0 2px rgba(66, 153, 225, 0.5)' : 'none'
          }}
          onClick={() => {
            if (!isOccupied && !isCurrentUserSpot) {
              handleSpotSelection(spotNumber);
            } else if (isOccupied) {
              alert('This parking spot is already occupied.');
            }
          }}
        >
          {spotNumber}
        </div>
      );
    });
  };

  return(
    <>
      <div className="relative w-full h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
        <div className="border-b-2 border-blue-900 w-full h-24 text-blue-900 flex flex-col items-center justify-center mt-10 text-xl tracking-wider">
              <h1 className="text-bold text-3xl tracking-widest">PARKING SYSTEM</h1>
            </div>
            <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/facultystaffdashboard" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/facultystaffparkingslot" className="group no-underline h-16 flex items-center pl-8 bg-blue-900 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white  border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/facultystaffaccount" className="group no-underline w-full h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Account</span>
              </li>
            </Link>
            <Link to="/facultystaffabout" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsQuestionSquare /> <span className="ml-5">About</span>
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
          <div className="container bg-blue-900 mx-auto p-4 h-4/5 rounded mt-20 border-2 overflow-auto">
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
                <option value="tricycle">Tricycle</option>
                <option value="fourwheeler">Four Wheeler</option>
              </select>
              {selectedVehicle === 'motorcycle' && (
                <div className="font-semibold text-sm mt-2 flex items-center text-gray-400">
                  <BsExclamationDiamond className="mr-2 text-red-500" />
                  <span className="text-red-500">Notice: &nbsp;</span>
                  <span>The Parking Slots of 1-100 is located at the EARTS/CIT. And the Parking Slots for 101-110 is located at the Guard House.</span>
                </div>
              )}
              {selectedVehicle === 'fourwheeler' && (
                <div className="font-semibold text-sm mt-2 flex items-center text-gray-400">
                  <BsExclamationDiamond className="mr-2 text-red-500" />
                  <span className="text-red-500">Notice: &nbsp;</span>
                  <span>The Parking Slots of Four Wheeler is located at the front of the Engineering Building.</span>
                </div>
              )}
            </div>

            {Object.entries(categories).map(([category, { count, color }]) =>
              selectedVehicle === category ? (
                <div key={category} className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-white">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {selectedSpot !== null && (
                      <div className="mt-4">
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
        </div>
      </div>
    </>
  );
}