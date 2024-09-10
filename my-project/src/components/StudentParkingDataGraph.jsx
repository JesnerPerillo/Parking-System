import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function StudentMotorcyclePDF() {
  const [students, setStudents] = useState([]);
  const [vehicleCounts, setVehicleCounts] = useState({});

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://seagreen-wallaby-986472.hostingersite.com/fetchstudentsdata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setStudents(response.data.students);

          if (response.data.vehicleCounts) {
            const vehicleCounts = {};
            for (const [vehicle, count] of Object.entries(response.data.vehicleCounts)) {
              vehicleCounts[vehicle] = Number(count);
            }
            setVehicleCounts(vehicleCounts);
          } else {
            setVehicleCounts({});
          }
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  // Prepare the data for the bar chart
  const chartData = {
    labels: ['Motorcycle', 'Tricycle', 'Fourwheeler'], // Vehicle types
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(vehicleCounts), // Corresponding counts
        backgroundColor: [
          'rgba(222, 210, 0, 0.8)',  // Yellow for Motorcycle
          'rgba(54, 162, 235, 0.8)',  // Blue for Tricycle
          'rgba(255, 99, 132, 0.8)',  // Red for Fourwheeler
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)', // White border color
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
        titleColor: 'white', // Tooltip title color
        bodyColor: 'white', // Tooltip body color
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`, // Custom tooltip format
        },
      },
    },
    layout: {
      padding: {
        top: 20, // Adjust padding to fit text
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines on X-axis for cleaner look
        },
        ticks: {
          color: 'white', // Set X-axis labels color to white
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Light grid lines on Y-axis
        },
        ticks: {
          color: 'white', // Set Y-axis labels color to white
          beginAtZero: true, // Start the Y-axis at zero
          stepSize: 1, // Ensure only whole numbers are used
          callback: function(value) { 
            return Number.isInteger(value) ? value : null;
          },
        },
      },
    },
  };

  // Calculate total users
  const totalUsers = Object.values(vehicleCounts).reduce((total, count) => total + count, 0);

  return (
    <div className="w-auto p-2 h-auto flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-2xl">
      <h1 className="text-white text-xl tracking-widest">Students Data</h1>
      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-4 bg-yellow-400 rounded"></div>
          <span className="text-white text-sm">Motorcycle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-4 bg-blue-400 rounded"></div>
          <span className="text-white text-sm">Tricycle</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-4 bg-red-400 rounded"></div>
          <span className="text-white text-sm">Fourwheeler</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center" style={{ width: '80%', height: '80%' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      {/* Total Users Display */}
      <div className="mt-4">
        <h2 className="text-white text-lg">Total Users: {totalUsers}</h2>
      </div>
    </div>
  );
}
