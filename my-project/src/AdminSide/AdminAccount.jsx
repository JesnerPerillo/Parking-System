import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsCreditCard2Front, BsTaxiFront, BsFillPersonVcardFill, BsQuestionSquare } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { MdEditSquare, MdDeleteForever } from 'react-icons/md';
import GSO from '../Pictures/gsoo.png';

export default function AdminAccount() {
  const [userData, setUserData] = useState({});
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [admins, setAdmins] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [id, setId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewAdminClick = () => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setId('');
    setIsEditMode(false);
    setShowForm(true);
  };
  
  const handleEditClick = (admin) => {
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setId(admin.id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const filteredAdmins = admins.filter(admin =>
    admin.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update your input and table rendering
  <input
    type="text"
    className="w-60 h-10 rounded pl-3"
    placeholder="Search user"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams();
      for (const key in formData) {
        params.append(key, formData[key]);
      }
  
      if (isEditMode) {
        // Update existing admin
        const response = await axios.put(`https://seagreen-wallaby-986472.hostingersite.com/adminupdate.php?id=${id}`, params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        if (response.data.success) {
          setSuccess('Admin updated successfully!');
          setIsEditMode(false);
          setShowForm(false);
          alert('Admin updated successfully!');
        } else {
          setError(response.data.message || 'An error occurred.');
        }
      } else {
        // Create new admin
        const response = await axios.post('https://seagreen-wallaby-986472.hostingersite.com/admincreate.php', params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });
        if (response.data.success) {
          setSuccess('New admin created successfully!');
          setFormData({ name: '', email: '', password: '' });
          setShowForm(false);
          alert('New admin created successfully!');
        } else {
          setError(response.data.message || 'An error occurred.');
        }
      }
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      setError('Failed to submit: ' + error.message);
    }
  };
  

  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this admin?');

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(`https://seagreen-wallaby-986472.hostingersite.com/admindelete.php?id=${id}`);
      if (response.data.success) {
        setSuccess('Admin deleted successfully!');
        fetchAdmins();
        alert('Admin user Deleted successfully!');
      } else {
        setError('Failed to delete admin: ' + response.data.message);
      }
    } catch (error) {
      setError('Error deleting admin: ' + error.message);
    }
  };
  

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/logout.php', {
        withCredentials: true,
      });

      console.log('Logout response: ', response.data);

      if (response.data.success) {
        navigate('/');
      } else {
        setError('Error logging out: ', response.error);
      }
    } catch (error) {
      setError('Error logging out: ' + error.message);
      console.log('Error logging out: ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/adminfetchdata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch(error) {
        setError('Error fetching data: ' + error.message);
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/admingetadmins.php', {
        withCredentials: true,
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admin data: ', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);
  
  
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
            <Link to="/adminparkingslot" className="group no-underline h-16 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-base xl:text-2xl ml-5">
              <BsTaxiFront /> <span className="ml-5">Parking Slot</span>
              </li>
            </Link>
            <Link to="/adminreport" className="group no-underline w-full h-16 flex items-center pl-8 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white text-2xl text-blue-700 tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
              <BsFillPersonVcardFill /> <span className="ml-5">Report</span>
              </li>
            </Link>
            <Link to="/adminaccount" className="group no-underline h-16 flex items-center pl-8 bg-blue-700 hover:bg-blue-700 mb-2 duration-200 lg:pl-3">
              <li className="group-hover:text-white border-l-2 border-white pl-5 text-2xl text-white tracking-widest flex items-center w-full lg:text-xl xl:text-2xl ml-5">
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
        <div className="w-full h-9/10.5">
          <div className="w-full h-full sm:p-4">
            <div className="w-full flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-white text-lg md:text-xl">Users</h1>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <input
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  type="text"
                  className="w-full md:w-60 h-10 rounded pl-3"
                  placeholder="Search user"
                />
                <button className="bg-white w-full md:w-20 h-10 rounded font-bold text-gray-500 hover:text-black">
                  Go
                </button>
                <button
                  onClick={handleNewAdminClick}
                  className="bg-white w-full md:w-40 h-10 rounded text-gray-500 hover:text-black"
                >
                  + New Admin
                </button>
              </div>
            </div>
            <div className="w-full h-auto overflow-auto">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="p-3 border">#</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Password</th>
                    <th className="p-3 border">Edit</th>
                    <th className="p-3 border">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin, index) => (
                      <tr key={admin.id} className="hover:bg-gray-100">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border">{admin.Name}</td>
                        <td className="p-3 border">{admin.Email}</td>
                        <td className="p-3 border">{admin.Password}</td>
                        <td className="p-3 border">
                          <button
                            onClick={() => handleEditClick(admin)}
                            className="bg-green-500 rounded text-white p-2 flex items-center space-x-1"
                          >
                            <span>Edit</span>
                            <MdEditSquare />
                          </button>
                        </td>
                        <td className="p-3 border">
                          <button
                            onClick={() => handleDeleteClick(admin.id)}
                            className="bg-red-500 rounded text-white p-2 flex items-center space-x-1"
                          >
                            <span>Delete</span>
                            <MdDeleteForever />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500">No admin data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {showForm && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-6 rounded shadow-md w-full max-w-md"
                >
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {isEditMode ? (
                    <>
                      <button
                        type="submit"
                        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
                      >
                        Update Admin
                      </button>
                      <button
                        onClick={() => setShowForm(false)}
                        type="button"
                        className="w-full mt-3 bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                      >
                        Create Admin
                      </button>
                      <button
                        onClick={() => setShowForm(false)}
                        type="button"
                        className="w-full mt-3 bg-gray-500 text-white p-2 rounded hover:bg-gray-700"
                      >
                        Close
                      </button>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}