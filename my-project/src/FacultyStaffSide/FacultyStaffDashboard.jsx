/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCreditCard2Front, BsArrowRight } from "react-icons/bs";
import { BsTaxiFront } from "react-icons/bs";
import { BsExclamationDiamond } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { BsQuestionSquare } from "react-icons/bs";
import { FaMotorcycle, FaCarRear } from "react-icons/fa6";
import TricycleImage from "../components/tricycle.png";
import Motorcycle from "../components/motor.png";
import Tricycle from "../components/tricyclepic.png";
import Car from "../components/car.png";

export default function FacultyStaffDashboard() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("Motorcycle");

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const getVehicleImage = () => {
    switch (selectedVehicle) {
      case "Motorcycle":
        return Motorcycle;
      case "Tricycle":
        return Tricycle;
      case "FourWheeler":
        return Car;
      default:
        return Motorcycle;
    }
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

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
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/facultyfetchdata.php', {
          withCredentials: true
        });

        if (response.data.success) {
          setUserData(response.data.data); // Assuming `data` contains the user information
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-blue-900 flex">
        {/* Navigation button */}
        <button
          className="lg:hidden bg-white text-blue-900 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

          {/* Navigation menu */}
          <nav className={`bg-white absolute inset-y-0 left-0 transform lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-md:flex max-md:flex-col max-md:items-center md:flex md:flex-col md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
            <div className="border-b-2 border-blue-900 w-full h-24 text-blue-900 flex flex-col items-center justify-center mt-10 text-xl tracking-wider">
              <h1 className="text-bold text-3xl tracking-widest">PARKING SYSTEM</h1>
            </div>
            <div className="flex w-full flex-col justify-evenly h-2/4 relative">
            <Link to="/facultystaffdashboard" className="group no-underline h-16 flex items-center pl-8 bg-blue-900 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsCreditCard2Front /> <span className="ml-5">Dashboard</span>
              </li>
            </Link>
            <Link to="/facultystaffparkingslot" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-900 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-900 tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
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
            
          {isNavOpen ? '' : <div className="w-full h-screen">
            <div className="w-full h-20 flex justify-end items-end border-b-2">
              <p className="text-white font-semibold text-2xl tracking-widest z-10 mr-5">Parking Slots</p>
            </div>

            {/*Container for Motorcycle,Tricycle, Four Wheeler*/}
            <div className="w-full h-screen bg-blue-900 lg:h-5/6 sm:h-screen mt-20 flex flex-col sm:flex-row md:h-3/4">
              <div className="lg:w-1/2 mt-0 h-full mt-8 sm:mt-16 ml-0 sm:flex flex-col justify-around items-center">
                <div className="text-left">
                  <h1 className="text-white text-4xl sm:text-5xl md:text-4xl">
                    Find Your
                    <span className="block font-black lg:text-7xl sm:text-4xl md:text-5xl text-yellow-400">
                      PARKING SPOT
                    </span>
                  </h1>
                </div>
                <div className="flex justify-between lg:justify-around sm:flex justify-around mt-8 sm: sm:w-full sm:w-9/10 mt-12 mb-12 md:w-full md:ml-2 md:justify-around">
                  <div
                    onClick={() => handleVehicleClick("Motorcycle")}
                    className={`flex flex-col items-center justify-center w-24 sm:w-32 h-24 sm:h-32 rounded-xl md:w-28 ${
                      selectedVehicle === "Motorcycle" ? "bg-yellow-400" : "bg-white"
                    } cursor-pointer`}
                  >
                    <FaMotorcycle className="scale-150 sm:scale-300 mb-2" />
                    <p className="text-sm sm:text-base">Motorcycle</p>
                  </div>
                  <div
                    onClick={() => handleVehicleClick("Tricycle")}
                    className={`flex flex-col items-center justify-center w-24 sm:w-32 h-24 sm:h-32 rounded-xl md:w-32 ${
                      selectedVehicle === "Tricycle" ? "bg-yellow-400" : "bg-white"
                    } cursor-pointer`}
                  >
                    <img src={TricycleImage} alt="Tricycle" className="w-8 sm:w-12 h-8 sm:h-12" />
                    <p className="text-sm sm:text-base">Tricycle</p>
                  </div>
                  <div
                    onClick={() => handleVehicleClick("FourWheeler")}
                    className={`flex flex-col items-center justify-center w-24 sm:w-32 h-24 sm:h-32 rounded-xl md:w-32 ${
                      selectedVehicle === "FourWheeler" ? "bg-yellow-400" : "bg-white"
                    } cursor-pointer`}
                  >
                    <FaCarRear className="scale-150 sm:scale-300 mb-2" />
                    <p className="text-xs sm:text-base">Four Wheeler</p>
                  </div>
                  </div>
                  <div className="w-full sm:w-2/4 flex justify-center mt-8 md:w-full">
                    <Link
                      to="/studentparkingslot"
                      className="flex items-center no-underline text-base lg:w-3/4 sm:text-xl justify-center w-9/10 h-12 sm:h-14 p-2 rounded bg-gray-900 text-white"
                    >
                      Check Availability <BsArrowRight className="scale-125 sm:scale-150 ml-3" />
                    </Link>
                  </div>
                </div>
              <div className="w-full h-screen lg:w-1/2 sm:w-1/2 h-64 sm:h-full flex items-center justify-center">
                <img src={getVehicleImage()} alt={`${selectedVehicle} Image`} className="max-w-full h-auto sm:h-3/4" />
              </div>
            </div>
          </div>}
        {error && <p className="absolute" style={{ color: 'red'}}>{error}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
      </div>
    </>
  );
}
