import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import axios from 'axios';

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [filters, setFilters] = useState({ name: '', date: '', month: '' });
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  const fetchGuests = async () => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams(filters).toString();
    const url = query
      ? `https://hotelguest-pro-5agn.onrender.com/api/guests/filter?${query}`
      : `https://hotelguest-pro-5agn.onrender.com/api/guests`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGuests(res.data);
  };

  const fetchHotelName = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://hotelguest-pro-5agn.onrender.com/api/guests/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHotelName(res.data.hotelName);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else {
      fetchGuests();
      fetchHotelName();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const exportToExcel = async () => {
    if (guests.length === 0) {
      alert("No data to export");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Guests");

    worksheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Arrival Date', key: 'arrivalDate', width: 15 },
      { header: 'Arrival Time', key: 'arrivalTime', width: 15 },
      { header: 'Room Number', key: 'roomNumber', width: 10 },
      { header: 'Guest Name', key: 'name', width: 20 },
      { header: "Father's Name", key: 'fatherName', width: 20 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Accompanying Names', key: 'accompanyingNames', width: 25 },
      { header: 'Relations with Accompanying', key: 'accompanyingRelations', width: 25 },
      { header: 'Nationality', key: 'nationality', width: 15 },
      { header: 'Purpose of Visit', key: 'purposeOfVisit', width: 20 },
      { header: 'Occupation', key: 'occupation', width: 15 },
      { header: 'Coming From', key: 'comingFrom', width: 20 },
      { header: 'Going To', key: 'goingTo', width: 20 },
      { header: 'Full Address', key: 'fullAddress', width: 30 },
      { header: 'Departure Date', key: 'departureDate', width: 15 },
      { header: 'Departure Time', key: 'departureTime', width: 15 },
      { header: 'Phone Number', key: 'phone', width: 15 },
      { header: 'Vehicle Number', key: 'vehicleNumber', width: 15 },
      { header: 'Male', key: 'male', width: 8 },
      { header: 'Female', key: 'female', width: 8 },
      { header: 'Boys', key: 'boys', width: 8 },
      { header: 'Girls', key: 'girls', width: 8 },
      { header: 'Aadhaar Image Links', key: 'aadharImages', width: 40 },
    ];

    guests.forEach(g => {
      worksheet.addRow({
        ...g,
        male: g.numberOfPersons?.male,
        female: g.numberOfPersons?.female,
        boys: g.numberOfPersons?.boys,
        girls: g.numberOfPersons?.girls,
        aadharImages: g.aadharImages?.join(', '),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "guest-records.xlsx";
    link.click();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.put(`https://hotelguest-pro-5agn.onrender.com/api/guests/${editData._id}`, editData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditData(null);
    fetchGuests();
  };

  const tableHeaders = [
    'S.No', 'Arrival Date', 'Arrival Time', 'Room Number', 'Guest Name', "Father's Name", 'Age',
    'Accompanying Names', 'Relations with Accompanying', 'Nationality', 'Purpose of Visit', 'Occupation',
    'Coming From', 'Going To', 'Full Address', 'Departure Date', 'Departure Time', 'Phone Number', 'Vehicle Number',
    'Male', 'Female', 'Boys', 'Girls', 'Aadhaar Images', 'Actions'
  ];

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-400">
        <thead className="bg-[#244855] text-white">
          <tr>
            {tableHeaders.map(h => <th key={h} className="px-4 py-2">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {guests.map((g, i) => (
            <tr key={i} className="border-t text-sm">
              <td className="px-4 py-2">{g.sno}</td>
              <td className="px-4 py-2">{g.arrivalDate}</td>
              <td className="px-4 py-2">{g.arrivalTime}</td>
              <td className="px-4 py-2">{g.roomNumber}</td>
              <td className="px-4 py-2">{g.name}</td>
              <td className="px-4 py-2">{g.fatherName}</td>
              <td className="px-4 py-2">{g.age}</td>
              <td className="px-4 py-2">{g.accompanyingNames}</td>
              <td className="px-4 py-2">{g.accompanyingRelations}</td>
              <td className="px-4 py-2">{g.nationality}</td>
              <td className="px-4 py-2">{g.purposeOfVisit}</td>
              <td className="px-4 py-2">{g.occupation}</td>
              <td className="px-4 py-2">{g.comingFrom}</td>
              <td className="px-4 py-2">{g.goingTo}</td>
              <td className="px-4 py-2">{g.fullAddress}</td>
              <td className="px-4 py-2">{g.departureDate}</td>
              <td className="px-4 py-2">{g.departureTime}</td>
              <td className="px-4 py-2">{g.phone}</td>
              <td className="px-4 py-2">{g.vehicleNumber}</td>
              <td className="px-4 py-2">{g.numberOfPersons?.male}</td>
              <td className="px-4 py-2">{g.numberOfPersons?.female}</td>
              <td className="px-4 py-2">{g.numberOfPersons?.boys}</td>
              <td className="px-4 py-2">{g.numberOfPersons?.girls}</td>
              <td className="px-4 py-2">
                {g.aadharImages?.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline block">
                    Aadhaar {idx + 1}
                  </a>
                ))}
              </td>
              <td className="px-4 py-2">
                <button onClick={() => setEditData(g)} className="text-yellow-600 hover:underline mr-2">Edit</button>
                <button
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    await axios.delete(`https://hotelguest-pro-5agn.onrender.com/api/guests/${g._id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchGuests();
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
