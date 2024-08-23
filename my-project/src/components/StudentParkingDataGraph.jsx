import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentMotorcyclePDF() {
  const [students, setStudents] = useState([]);
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/fetchstudentsdata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setStudents(response.data.students);
          setTotalStudents(response.data.students.length);

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

  // Prepare the data for the pie chart
  const chartData = {
    labels: Object.keys(vehicleCounts), // Vehicle types
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(vehicleCounts), // Corresponding counts
        backgroundColor: [
          'rgba(222, 210, 0, 0.8)',  // Yellow
          'rgba(54, 162, 235, 0.8)',  // Blue
          'rgba(255, 99, 132, 0.8)',  // Red
          'rgba(255, 206, 86, 0.8)',  // Yellow
          'rgba(75, 192, 192, 0.8)',  // Teal
        ], // Colors for each slice
        borderColor: 'rgba(255, 255, 255, 0.8)', // White border color between slices
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white', // Set legend text color to white
          font: {
            size: 14, // Adjust font size of legend
          },
        },
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
    elements: {
      arc: {
        borderWidth: 2, // Border width of pie slices
      },
    },
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center">
        <span className="text-4xl text-white mb-4">{totalStudents}/335</span>
        <div style={{ width: '70%', height: '70%' }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}
