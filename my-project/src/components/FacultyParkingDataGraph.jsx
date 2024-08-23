import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FacultyParkingDataGraph() {
  const [vehicleCounts, setVehicleCounts] = useState({});
  const [totalFaculty, setTotalFaculty] = useState(0);

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/fetchfacultydata.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          setTotalFaculty(response.data.faculty.length);

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
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchFacultyData();
  }, []);

  // Prepare the data for the pie chart
  const chartData = {
    labels: Object.keys(vehicleCounts), // Vehicle types
    datasets: [
      {
        label: 'Number of Faculty/Staff',
        data: Object.values(vehicleCounts), // Corresponding counts
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ], // Bar colors
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ], // Border colors
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
          font: {
            size: 12, // Adjust legend font size
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip format
          },
        },
      },
    },
    layout: {
      padding: {
        top: 20, // Adjust padding to fit text
      },
    },
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center">
        <span className="text-4xl text-white">{totalFaculty}</span>
        <div style={{ width: '60%', height: '60%' }}>
          <Pie data={chartData} options={chartOptions} /> {/* Render the pie chart */}
        </div>
      </div>
    </>
  );
}
