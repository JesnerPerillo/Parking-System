import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function StudentTricyclePDF() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [vehicleCounts, setvehicleCounts] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('http://localhost/website/my-project/Backend/fetchstudentsdata.php', {
          withCredentials: true,
        });

        console.log('Student data response: ' + response.data);

        if (response.data.success) {
          const tricycleStudents = response.data.students.filter(student => student.Vehicle === 'Tricycle');
          setStudents(tricycleStudents);

          if (response.data.vehicleCounts) {
            const vehicleCounts = {};
            for (const [vehicle, count] of Object.entries(response.data.vehicleCounts)) {
              vehicleCounts[vehicle] = Number(count);
            }
            setvehicleCounts(vehicleCounts);
          } else {
            setvehicleCounts({});
          }
        } else {
          setError(response.data.message || 'No data found for the logged-in user.');
        }
      } catch (error) {
        setError('Error fetching data:'+ error.message);
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('Tricycle Students Data', 10, 10);

    const tableColumn = ["#", "Student Number", "Name", "Email", "Vehicle", "Plate Number", "Parking Slot"];
    const tableRows = [];

    students.forEach((student, index) => {
      const studentData = [
        index + 1,
        student['Student Number'],
        student.Name,
        student.Email,
        student.Vehicle,
        student['Plate Number'],
        student.slot_number,
      ];
      tableRows.push(studentData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 102] },
      styles: { fontSize: 10 },
    });

    doc.save('Student-Tricycle.pdf');
  };


  return (
    <>
      <div className="relative w-full h-full flex flex-col items-center">
        <span className="text-4xl mt-10">{vehicleCounts['Tricycle'] || 0}/15</span>
        <button className="w-full h-1/4 bg-red-600 rounded text-white absolute bottom-0 mb-1" onClick={generatePDF}>Generate PDF</button>
      </div>
    </>
  );
}