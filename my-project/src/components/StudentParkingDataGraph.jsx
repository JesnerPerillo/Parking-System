import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  // Prepare the data for the chart
  const chartData = {
    labels: Object.keys(vehicleCounts), // Vehicle types
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(vehicleCounts), // Corresponding counts
        backgroundColor: 'rgba(222, 210, 0, 1)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
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
        },
      },
      title: {
        display: true,
        text: 'Number of Students by Vehicle Type',
        color: 'white', // Set title text color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis label color to white
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 1, // Ensure only whole numbers are displayed
          color: 'white', // Set y-axis label color to white
        },
      },
    },
  };

  return (
    <>
      <div className="w-full h-full mt-5 flex flex-col items-center">
        <span className="text-4xl mt-10 text-white">{totalStudents}/335</span>
        <Bar data={chartData} options={chartOptions} /> {/* Render the bar chart */}
      </div>
    </>
  );
}
