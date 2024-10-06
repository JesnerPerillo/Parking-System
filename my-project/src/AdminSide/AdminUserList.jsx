import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCreditCard2Front, BsTaxiFront, BsFillPersonVcardFill, BsQuestionSquare, BsPersonFillGear } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { MdDeleteForever, MdEdit   } from 'react-icons/md';
import GSO from '../Pictures/gsoo.png';
import { FaUsers, FaClipboardList  } from "react-icons/fa";
import 'jspdf-autotable';
import { IoEyeOff, IoEye } from "react-icons/io5";
import { FaCircleCheck, FaRegCircleCheck} from "react-icons/fa6";

export default function AdminUserList() {
  const [userData, setUserData] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('student'); // Default to 'student'
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedType, setSelectedType] = useState('student');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);
  const [idPendingDelete, setIdPendingDelete] = useState({ id: null, userType: null });
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userIdToApprove, setUserIdToApprove] = useState(null);
  const [approveDelete, setApproveDelete] = useState(false);
  const [idApproveDelete, setIdApproveDelete] = useState({ id: null, userType: null });
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [approveMessage, setApproveMessage] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
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

  const togglePending = () => {
    setShowPending(!showPending);
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  }

  const handleOpenModal = (src) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };

  const handleCloseModal =() => {
    setIsModalOpen(false);
    setModalImageSrc('');
  };

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

    // Debug: Check userData and its id
    console.log('userData:', selectedUserData);
    console.log('userData.id:', selectedUserData.id);

    const form = new FormData();
    const currentFormData = formData[type]; // Get the form data for the selected type

    // Append fields from the specific user type
    for (const key in currentFormData) {
        form.append(key, currentFormData[key]);
    }

    // Check if id is defined before appending
    if (selectedUserData.id) {
        form.append('id', selectedUserData.id);
    } else {
        console.error('ID is undefined');
        alert('ID is missing. Please ensure you have selected a user.');
        return; // Stop submission if ID is not valid
    }

    // Determine the URL based on the type (student or faculty/staff)
    const url = type === 'student'
        ? 'https://skyblue-clam-769210.hostingersite.com/admineditstudent.php'
        : 'https://skyblue-clam-769210.hostingersite.com/admineditfaculty.php';

    // Log the form data being sent
    console.log('Form data being sent:', Array.from(form.entries())); // Convert FormData to a readable array

    try {
        const response = await axios.post(url, form, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Response data:', response.data);

        if (response.data.success) {
            setUserData((prev) => ({
                ...prev,
                ...currentFormData,
                password: '', // Don't show the password in user data
            }));
            alert('Account updated successfully');
            setIsEditModalOpen(false);
            setUserData(false);
            window.location.reload();
        } else {
            alert('Error: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error updating account:', error);
        alert('Error updating account. Please try again.');
    }
};


useEffect(() => {
  const fetchAdminData = async () => {
    try {
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/adminfetchdata.php', {
        withCredentials: true,
      });

      if (response.data.success) {
        // Handle admin data if needed
      } else {
        setError(response.data.message || 'No data found for the admin.');
        navigate('/');
      }
    } catch (error) {
      setError('Error fetching admin data: ' + error.message);
      console.error('Error fetching admin data: ', error);
      navigate('/');
    }
  };

  fetchAdminData();
}, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('https://skyblue-clam-769210.hostingersite.com/logout.php', {
        withCredentials: true,
      });

      if (response.data.success) {
        navigate('/');
      } else {
        setError('Error logging out');
      }
    } catch (error) {
      setError('Error logging out: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            let apiUrl =
                selectedUserType === 'student'
                    ? 'https://skyblue-clam-769210.hostingersite.com/fetchstudentsdata.php'
                    : 'https://skyblue-clam-769210.hostingersite.com/fetchfacultydata.php';

            const response = await axios.get(apiUrl, { withCredentials: true });

            console.log('User data response:', response.data);

            if (response.data.success) {
                // Set the userData array with all users
                setUserData(selectedUserType === 'student' ? response.data.students : response.data.faculty);
                setError(null); // Clear any previous error
            } else {
                setUserData([]); // Clear the userData if no users found
                setError(response.data.message || 'No data found.');
            }
        } catch (error) {
            setUserData([]); // Ensure userData is empty on fetch error
            setError('Error fetching data: ' + error.message);
        }
    };

    fetchUserData();
}, [selectedUserType]); // Fetch the user list when selectedUserType changes

useEffect(() => {
    const fetchSelectedUserData = async () => {
        if (userId) {
            try {
                let apiUrl =
                    selectedUserType === 'student'
                        ? `https://skyblue-clam-769210.hostingersite.com/fetchstudentdata.php?id=${userId}` // Example endpoint
                        : `https://skyblue-clam-769210.hostingersite.com/fetchfacultydata.php?id=${userId}`; // Example endpoint

                const response = await axios.get(apiUrl, { withCredentials: true });

                console.log('Selected user data response:', response.data);

                if (response.data.success) {
                    setSelectedUserData(response.data.user); // Assuming response contains a user object
                    setError(null); // Clear any previous error
                } else {
                    setSelectedUserData(null); // Clear selected user data if not found
                    setError(response.data.message || 'No user found.');
                }
            } catch (error) {
                setSelectedUserData(null); // Ensure selectedUserData is null on fetch error
                setError('Error fetching user data: ' + error.message);
            }
        }
    };

    fetchSelectedUserData();
}, [userId]); // Fetch specific user data when userId changes

  
const handleDelete = async (userId, userType) => {
  try {
      const response = await axios.post(
          'https://skyblue-clam-769210.hostingersite.com/delete.php', 
          { id: userId, userType },
          { 
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' }
          }
      );

      if (response.data.success) {
          setDeleteSuccess(true);
          setApproveDelete(false);
          setUserData(prevUserData => prevUserData.filter(user => user.id !== userId)); // Ensure `user.id` is the right field
      } else {
          alert('Failed to delete user: ' + (response.data.message || 'Unknown error'));
      }
  } catch (error) {
      console.error('Error deleting user:', error); // Log error for debugging
      alert('Error deleting user: ' + error.message);
  }
};


useEffect(() => {
  const fetchPendingUsersData = async () => {
    console.log('Fetching pending users for type:', selectedType);
    try {
      // Fetch data for pending users based on the selected type (student or faculty)
      let apiUrl = `https://skyblue-clam-769210.hostingersite.com/fetchpendinguser.php`;
      const response = await axios.get(apiUrl, { withCredentials: true });

      // Log the entire response object for debugging
      console.log('Pending users response object:', response);

      // Check if the data property exists
      if (response.data) {
        if (response.data.success) {
          // Access the pending users based on selected type
          const pendingUsersData = response.data.pendingUsers[selectedType] || [];

          // Check if users data is available
          if (pendingUsersData.length > 0) {
            console.log(`Pending ${selectedType}:`, pendingUsersData);
            setPendingUsers(pendingUsersData);
            setError(null);
          } else {
            console.log(`No pending ${selectedType} found:`, response.data.message);
            setPendingUsers([]);
            setError(`No pending ${selectedType} found.`);
          }
        } else {
          console.log('Error fetching pending users:', response.data.message);
          setPendingUsers([]);
          setError(response.data.message || 'Error fetching pending users.');
        }
      } else {
        console.log('Unexpected response structure:', response);
        setPendingUsers([]);
        setError('Unexpected response structure.');
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setPendingUsers([]);
      setError('Error fetching pending users: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  // Fetch the data whenever selectedType changes
  fetchPendingUsersData();
}, [selectedType]);


    // Handle user type change (student or faculty)
    const handleUserTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type); // Update selected type
    };

// Approve user
const handleApprove = (userId) => {
  // Show the confirmation modal before approval
  setUserIdToApprove(userId);
  setApproveMessage(true);
};

// Function to confirm the approval
const confirmApprove = () => {
  axios
    .post(
      `https://skyblue-clam-769210.hostingersite.com/handleapproveincorrect.php`,
      { id: userIdToApprove, action: 'approve' },
      { withCredentials: true }
    )
    .then((response) => {
      setPendingUsers((prev) => prev.filter((user) => user.id !== userIdToApprove));
      setPopupMessage("User approved and email sent.");
      setIsPopupVisible(true);
    })
    .catch((error) => {
      console.error("Error approving user:", error);
    });
  setApproveMessage(false); // Close modal after action
};

const cancelApprove = () => {
  setApproveMessage(false); // Close modal if cancelled
};

const handleDeletePending = (userId) => {
  // Set the user ID to be deleted and show the confirmation modal
  setUserIdToDelete(userId);
  setPendingDelete(true);
};

// Confirm deletion function
const confirmDelete = async (userIdToDelete, selectedType) => {
  try {
    // Send a POST request to the backend for deletion
    const response = await axios.post(
      'https://skyblue-clam-769210.hostingersite.com/deletepending.php', 
      { id: userIdToDelete, type: selectedType }, // Include the user ID and user type
      { 
        withCredentials: true, // To handle cookies/sessions if necessary
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('Response from backend:', response.data); // Log backend response for debugging

    // Check if the deletion was successful
    if (response.data.success) {
      setDeleteSuccess(true); // Set success state
      setPendingUsers(prev => prev.filter(user => user.id !== userIdToDelete)); 
      setPendingDelete(false);
      setIsPopupVisible(false);
    } else {
      setPopupMessage(response.data.message || "Failed to delete user."); // Set error message if delete fails
    }

    setIsPopupVisible(true); // Show popup message for success or failure
    setPendingDelete(false); // Close the delete confirmation modal
  } catch (error) {
    console.error("Error deleting user:", error); // Log error for debugging
    setPopupMessage("Error deleting user. Please try again."); // Set generic error message
    setIsPopupVisible(true); // Show error message in popup
    setPendingDelete(false); // Close modal even if error occurs
  }
};




const Popup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
    <div className="bg-white p-4 flex flex-col items-center rounded shadow-lg">
      <FaRegCircleCheck className="text-green-500 h-10 w-10 mb-2"/>
      <p>{message}</p>
      <button onClick={onClose} className="mt-4 bg-gray-500 text-white py-2 px-4 rounded">
        Close
      </button>
    </div>
  </div>
);

const [searchTerm, setSearchTerm] = useState('');
  const [searchTermPending, setSearchTermPending] = useState('');

  // Filtering approved users
  const filteredUsers = Array.isArray(userData) ? userData.filter((user) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (selectedUserType === 'student') {
      return (
        user['Student Number']?.toLowerCase().includes(lowerSearchTerm) ||
        user.Name?.toLowerCase().includes(lowerSearchTerm) ||
        user.slot_number?.toString().toLowerCase().includes(lowerSearchTerm) ||
        user['Plate Number']?.toLowerCase().includes(lowerSearchTerm)
      );
    } else {
      return (
        user['Employee Id']?.toLowerCase().includes(lowerSearchTerm) ||
        user.Name?.toLowerCase().includes(lowerSearchTerm) ||
        user.Position?.toLowerCase().includes(lowerSearchTerm) ||
        user.Building?.toLowerCase().includes(lowerSearchTerm) ||
        user.slot_number?.toString().toLowerCase().includes(lowerSearchTerm) ||
        user['Plate Number']?.toLowerCase().includes(lowerSearchTerm)
      );
    }
  }) : [];

  // Filtering pending users
  const filteredPendingUsers = pendingUsers.filter((user) => {
    const lowerSearchTermPending = searchTermPending.toLowerCase();
    if (selectedUserType === 'student') {
      return (
        user['Student Number']?.toLowerCase().includes(lowerSearchTermPending) ||
        user.Name?.toLowerCase().includes(lowerSearchTermPending) ||
        user['Plate Number']?.toLowerCase().includes(lowerSearchTermPending)
      );
    } else {
      return (
        user['Employee Id']?.toLowerCase().includes(lowerSearchTermPending) ||
        user.Name?.toLowerCase().includes(lowerSearchTermPending) ||
        user.Position?.toLowerCase().includes(lowerSearchTermPending) ||
        user.Building?.toLowerCase().includes(lowerSearchTermPending) ||
        user['Plate Number']?.toLowerCase().includes(lowerSearchTermPending)
      );
    }
  });


  return (
    <>
      <div className="relative w-full h-screen bg-blue-700 flex">
        {/* Navigation */}
        <button
          className="lg:hidden bg-white text-blue-700 p-2 rounded-full h-10 w-10 absolute top-4 left-4 z-10"
          onClick={toggleNav}
        >
          {isNavOpen ? '✕' : '☰'}
        </button>

        {/* Navigation menu */}
        <nav className={`bg-white rounded-r-2xl drop-shadow-2xl absolute inset-y-0 left-0 transform xl:w-1/5 lg:relative lg:translate-x-0 lg:top-0 lg:w-1/4 lg:h-screen lg:flex lg:flex-col lg:items-center lg:justify-around lg:overflow-y-auto max-sm:flex max-sm:flex-col max-sm:items-center max-sm:justify-around max-md:flex max-md:flex-col max-md:justify-around max-md:items-center md:flex md:flex-col md:justify-around md:items-center ${isNavOpen ? 'block w-full' : 'max-sm:hidden md:hidden max-md:hidden'}`}>
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
            <Link to="/adminparkingslot" className="group no-underline h-14 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-lg text-blue-700 tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
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
            <Link to="/adminuserlist" className="group no-underline h-12 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-lg text-white tracking-widest flex items-center w-full lg:text-sm xl:text-lg ml-5">
              <FaUsers /> <span className="ml-5">User List</span>
              </li>
            </Link>
          </div>
          <button className="w-full bg-blue-900 h-12 text-red-600 font-semibold tracking-widest text-lg bg-white flex items-center justify-center" onClick={() => setLogoutMessage(true)}>
            <span className="hover:text-white hover:bg-red-600 flex items-center justify-center w-full h-full transition ease-linear duration-200"><FiLogOut className="rotate-180 mr-2"/>Logout</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="w-full h-screen flex flex-col">
          <div className="w-full h-20 flex justify-end items-end border-b-2 sm:justify-start md:justify-end">
            <p className="text-white font-semibold text-2xl tracking-widest z-10 ml-5">User List</p>
          </div>
        <div className="w-full h-screen">
          <h2 className="text-white font-semibold ml-10 mt-10 text-2xl flex">User's List <FaClipboardList className="ml-5"/></h2>

          {/* Table */}
          <div className="bg-white h-4/5 p-3 rounded-lg shadow-md overflow-x-auto w-11/12 mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h2>Approved</h2>
            <div className="w-1/3 flex justify-between items-center">
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  type="text"
                  className="w-full border md:w-60 h-10 rounded pl-3"
                  placeholder="Search user"
                />
              <button onClick={togglePending} className="p-2 h-10 w-32 bg-yellow-500 rounded text-white">Pending</button>
              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="bg-blue-700 text-white p-2 rounded"
              >
                <option value="student">Students</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          </div>
            <table table className="max-w-5/6 table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-xs font-bolder">
                  {selectedUserType === 'student' ? (
                    <>
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Student Number</th>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Year & Section</th>
                      <th className="border border-gray-300 px-4 py-2">Course</th>
                      <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                      <th className="border border-gray-300 px-4 py-2">Slot Number</th>
                      <th className="border border-gray-300 px-4 py-2">Plate Number</th>
                      <th className="border border-gray-300 px-4 py-2">License</th>
                      <th className="border border-gray-300 px-4 py-2">ORCR</th>
                      <th className="border border-gray-300 px-4 py-2">COR</th>
                      <th className="border border-gray-300 px-4 py-2">Action</th>
                    </>
                  ) : (
                    <>
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Employee ID</th>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Position</th>
                      <th className="border border-gray-300 px-4 py-2">Building</th>
                      <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                      <th className="border border-gray-300 px-4 py-2">Slot Number</th>
                      <th className="border border-gray-300 px-4 py-2">Plate Number</th>
                      <th className="border border-gray-300 px-4 py-2">License</th>
                      <th className="border border-gray-300 px-4 py-2">ORCR</th>
                      <th className="border border-gray-300 px-4 py-2">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-150 text-xs">
                      {selectedUserType === 'student' ? (
                        <>
                          <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                          <td className="border border-gray-300 px-2 py-1">{user['Student Number']}</td>
                          <td className="border border-gray-300 px-2 py-1">{user.Name}</td>
                          <td className="border border-gray-300 px-2 py-1">{user.Email}</td>
                          <td className="border border-gray-300 px-2 py-1">{user['Year and Section']}</td>
                          <td className="border border-gray-300 px-2 py-1">{user.Course}</td>
                          <td className="border border-gray-300 px-2 py-1">{user.Vehicle}</td>
                          <td className="border border-gray-300 px-2 py-1">{user.slot_number || ''}</td>
                          <td className="border border-gray-300 px-2 py-1">{user['Plate Number']}</td>
                          <td className="border border-gray-300 px-2 py-1">
                            {user.License ? (
                              <>
                              <img onClick={() => handleOpenModal(`data:image/png;base64,${user.License}`)} src={`data:image/png;base64,${user.License}`} alt="License" className="w-16 h-16 object-cover rounded cursor-pointer" />
                              </>
                            ) : (
                              <span>No License</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-1">
                            {user.ORCR ? (
                              <>
                              <img onClick={() => handleOpenModal(`data:image/png;base64,${user.ORCR}`)} src={`data:image/png;base64,${user.ORCR}`} alt="ORCR" className="w-16 h-16 object-cover rounded cursor-pointer" />
                              </>
                            ) : (
                              <span>No ORCR</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-1">
                            {user.COR ? (
                              <>
                              <img onClick={() => handleOpenModal(`data:image/png;base64,${user.COR}`)} src={`data:image/png;base64,${user.COR}`} alt="COR" className="w-16 h-16 object-cover rounded cursor-pointer" />
                              </>
                            ) : (
                              <span>No COR</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-3 py-1">
                            <button onClick={() => {
                              setIsEditModalOpen(true);
                              const userDataToEdit = userData.find((u) => u.id === user.id);
                              setSelectedUserData(userDataToEdit);
                              setSelectedUserId(user.id);
                            }} className="text-green-600 hover:text-gray-900 transition duration-200">
                              <MdEdit  className="w-6 h-6"/>
                            </button>
                            <button onClick={() => {
                              setApproveDelete(true); 
                              setIdApproveDelete({ userId: user.id, userType: selectedUserType });
                          }} className="text-red-600 hover:text-red-900 transition duration-200">
                              <MdDeleteForever className="w-6 h-6" />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                          <td className="border border-gray-300 px-4 py-2">{user['Employee Id']}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.Name}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.Email}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.Position}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.Building}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.Vehicle}</td>
                          <td className="border border-gray-300 px-4 py-2">{user.slot_number || ''}</td>
                          <td className="border border-gray-300 px-4 py-2">{user['Plate Number']}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {user.License ? (
                              <img onClick={() => handleOpenModal(`data:image/png;base64,${user.License}`)} src={`data:image/png;base64,${user.License}`} alt="License" className="w-16 h-16 object-cover rounded cursor-pointer" />
                            ) : (
                              <span>No License</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {user.ORCR ? (
                              <img onClick={() => handleOpenModal(`data:image/png;base64,${user.ORCR}`)} src={`data:image/png;base64,${user.ORCR}`} alt="ORCR" className="w-16 h-16 object-cover rounded cursor-pointer" />
                            ) : (
                              <span>No ORCR</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-3 py-1">
                            <button onClick={() => {
                              setIsEditModalOpen(true);
                              const userDataToEdit = userData.find((u) => u.id === user.id);
                              setSelectedUserData(userDataToEdit);
                              setSelectedUserId(user.id);
                            }} className="text-green-600 hover:text-gray-900 transition duration-200">
                              <MdEdit  className="w-6 h-6"/>
                            </button>
                            <button onClick={() => {
                              setApproveDelete(true); 
                              setIdApproveDelete({ userId: user.id, userType: String(selectedUserType) });
                          }} className="text-red-600 hover:text-red-900 transition duration-200">
                              <MdDeleteForever className="w-6 h-6" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={selectedUserType === 'student' ? 12 : 11} className="p-2 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
                {isModalOpen && (
                  <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded">
                      <img src={modalImageSrc} alt="Enlarged" className="max-w-md max-h-screen" />
                      <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded" onClick={handleCloseModal}>
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>
          {isEditModalOpen && selectedUserData &&(
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
                    <option>{selectedUserData.Vehicle}</option>
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
                    type="submit"
                    onClick={console.log('selectedUserType:', selectedUserType)
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
                          <option>{userData.Vehicle}</option>
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
            
            {showPending && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
              <div className="bg-white rounded-lg w-9/10 max-h-4/5 max-sm:w-full overflow-auto p-4">
                <div className="w-full flex justify-between">
                  <h2 className="text-lg font-bold mb-4">Pending Users</h2>
                  <button onClick={() => setShowPending(false)} className="mb-4">Close</button>
                </div>

                {/* Filter: Select Student or Faculty */}
                <div className="flex justify-between items-center mb-4">
                  <label htmlFor="userType" className="font-semibold">
                    Select User Type:
                  </label>
                  <div className="w-1/4 flex justify-between">
                    <input
                    onChange={(e) => setSearchTermPending(e.target.value)}
                    value={searchTermPending}
                    type="text"
                    className="w-full border md:w-60 h-10 rounded pl-3"
                    placeholder="Search user"
                  />
                    <select
                      id="userType"
                      value={selectedType}
                      onChange={handleUserTypeChange}
                      className="p-2 rounded-md w-40 bg-gray-700 text-white"
                    >
                      <option value="student">Students</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                </div>

                {/* Table for Pending Users */}
                <table className="min-w-full text-xs table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      {selectedType === 'student' ? (
                        <>
                          <th className="border border-gray-300 px-4 py-2">#</th>
                          <th className="border border-gray-300 px-4 py-2">Student Number</th>
                          <th className="border border-gray-300 px-4 py-2">Name</th>
                          <th className="border border-gray-300 px-4 py-2">Email</th>
                          <th className="border w-20 border-gray-300 px-4 py-2">Year & Section</th>
                          <th className="border border-gray-300 px-4 py-2">Course</th>
                          <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                          <th className="border border-gray-300 px-4 py-2">Plate Number</th>
                          <th className="border border-gray-300 px-4 py-2">License</th>
                          <th className="border border-gray-300 px-4 py-2">ORCR</th>
                          <th className="border border-gray-300 px-4 py-2">COR</th>
                          <th className="border border-gray-300 px-4 py-2">Action</th>
                        </>
                      ) : (
                        <>
                          <th className="border border-gray-300 px-4 py-2">#</th>
                          <th className="border border-gray-300 px-4 py-2">Employee ID</th>
                          <th className="border border-gray-300 px-4 py-2">Name</th>
                          <th className="border border-gray-300 px-4 py-2">Email</th>
                          <th className="border border-gray-300 px-4 py-2">Position</th>
                          <th className="border border-gray-300 px-4 py-2">Building</th>
                          <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                          <th className="border border-gray-300 px-4 py-2">Plate Number</th>
                          <th className="border border-gray-300 px-4 py-2">License</th>
                          <th className="border border-gray-300 px-4 py-2">ORCR</th>
                          <th className="border border-gray-300 px-4 py-2">Action</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                  {filteredPendingUsers.length > 0 ? (
                      filteredPendingUsers.map((user, index)  => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                          {selectedType === 'student' ? (
                            <>
                              <td className="border border-gray-300 px-2 py-2">{index + 1}</td>
                              <td className="border w-20 border-gray-300 px-2 py-2">{user['Student Number']}</td>
                              <td className="border border-gray-300 px-2 py-2">{user.Name}</td>
                              <td className="border border-gray-300 px-2 py-2">{user.Email}</td>
                              <td className="border border-gray-300 px-2 py-2">{user['Year and Section']}</td>
                              <td className="border border-gray-300 px-2 py-2">{user.Course}</td>
                              <td className="border border-gray-300 px-2 py-2">{user.Vehicle}</td>
                              <td className="border border-gray-300 px-2 py-2">{user['Plate Number']}</td>

                              {/* License Image */}
                              <td className="border border-gray-300 px-2 py-2">
                                {user.License ? (
                                  <img
                                    onClick={() => handleOpenModal(`data:image/png;base64,${user.License}`)}
                                    src={`data:image/png;base64,${user.License}`}
                                    alt="License"
                                    className="w-16 h-16 object-cover rounded cursor-pointer"
                                  />
                                ) : (
                                  <span>No License</span>
                                )}
                              </td>

                              {/* ORCR Image */}
                              <td className="border border-gray-300 px-4 py-2">
                                {user.ORCR ? (
                                  <img
                                    onClick={() => handleOpenModal(`data:image/png;base64,${user.ORCR}`)}
                                    src={`data:image/png;base64,${user.ORCR}`}
                                    alt="ORCR"
                                    className="w-16 h-16 object-cover rounded cursor-pointer"
                                  />
                                ) : (
                                  <span>No ORCR</span>
                                )}
                              </td>

                              {/* COR Image */}
                              <td className="border border-gray-300 px-4 py-2">
                                {user.COR ? (
                                  <img
                                    onClick={() => handleOpenModal(`data:image/png;base64,${user.COR}`)}
                                    src={`data:image/png;base64,${user.COR}`}
                                    alt="COR"
                                    className="w-16 h-16 object-cover rounded cursor-pointer"
                                  />
                                ) : (
                                  <span>No COR</span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center justify-around space-x-2"> {/* Add a flex container for the buttons */}
                                  <button
                                    onClick={() => handleApprove(user.id)}
                                    className="text-green-600 hover:text-green-900 transition duration-200"
                                  >
                                    <FaCircleCheck className="h-6 w-6" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setPendingDelete(true);
                                      setIdPendingDelete({ userIdToDelete: user.id, userType: String(selectedUserType) });
                                    }}
                                    className="text-red-600 hover:text-red-900 transition duration-200"
                                  >
                                    <MdDeleteForever className="h-8 w-8" />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                              <td className="border border-gray-300 px-4 py-2">{user['Employee Id']}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.Name}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.Email}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.Position}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.Building}</td>
                              <td className="border border-gray-300 px-4 py-2">{user.Vehicle}</td>
                              <td className="border border-gray-300 px-4 py-2">{user['Plate Number']}</td>

                              {/* License Image */}
                              <td className="border border-gray-300 px-4 py-2">
                                {user.License ? (
                                  <img
                                    onClick={() => handleOpenModal(`data:image/png;base64,${user.License}`)}
                                    src={`data:image/png;base64,${user.License}`}
                                    alt="License"
                                    className="w-16 h-16 object-cover rounded cursor-pointer"
                                  />
                                ) : (
                                  <span>No License</span>
                                )}
                              </td>

                              {/* ORCR Image */}
                              <td className="border border-gray-300 px-4 py-2">
                                {user.ORCR ? (
                                  <img
                                    onClick={() => handleOpenModal(`data:image/png;base64,${user.ORCR}`)}
                                    src={`data:image/png;base64,${user.ORCR}`}
                                    alt="ORCR"
                                    className="w-16 h-16 object-cover rounded cursor-pointer"
                                  />
                                ) : (
                                  <span>No ORCR</span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center justify-around space-x-2"> {/* Add a flex container for the buttons */}
                                  <button
                                    onClick={() => handleApprove(user.id)}
                                    className="text-green-600 hover:text-green-900 transition duration-200"
                                  >
                                    <FaCircleCheck className="h-6 w-6" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setPendingDelete(true);
                                      setIdPendingDelete({ userIdToDelete: user.id, userType: String(selectedUserType) })}}
                                    className="text-red-600 hover:text-red-900 transition duration-200"
                                  >
                                    <MdDeleteForever className="h-8 w-8" />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={selectedType === 'student' ? 12 : 11} className="p-2 text-center text-gray-500">
                          No pending users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {isPopupVisible && (
            <Popup
              message={popupMessage}
              onClose={() => setIsPopupVisible(false)}
            />
          )}

        {pendingDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
              <p>Are you sure you want to delete pending this user?</p>
              <div className="mt-4 flex justify-around">
                <button
                  onClick={() => setPendingDelete(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  No
                </button>
                <button
                  onClick={() => confirmDelete(idPendingDelete.userIdToDelete, String(idPendingDelete.userType))}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {approveDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="mt-4 flex justify-around">
                <button
                  onClick={() => setApproveDelete(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(idApproveDelete.userId, String(idApproveDelete.userType))}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteSuccess && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white flex flex-col items-center text-center rounded-lg shadow-lg p-5">
            <FaRegCircleCheck className="w-12 text-green-500 h-12"/>
            <p>Deleted Successfully.</p>
            <div className="flex justify-around mt-4">
              <button className="mr-2 px-4 py-2 bg-gray-300 rounded" onClick={() => setDeleteSuccess(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Modal for approval confirmation */}
        {approveMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
            <div className="bg-white h-60 flex flex-col justify-around p-6 rounded-lg shadow-lg">
              <div>
                <p className="text-xl text-center">Approval</p>
                <p>Are you sure you want to approve this user?</p>
              </div>
              <div className="w-full flex justify-between">
                <button onClick={confirmApprove} className="p-2 bg-green-500 rounded w-1/3 text-white">Yes</button>
                <button onClick={cancelApprove} className="p-2 bg-gray-500 rounded w-1/3 text-white">No</button>
              </div>
            </div>
          </div>
        )}

        {/* Display the message popup after approval */}
        {isPopupVisible && (
          <div className="popup-message">
            {popupMessage}
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
      </div>
    </>
  );
}
