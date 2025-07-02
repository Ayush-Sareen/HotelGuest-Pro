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
      { header: 'Room No', key: 'roomNumber', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: "Father's Name", key: 'fatherName', width: 20 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Accompanying Names', key: 'accompanyingNames', width: 25 },
      { header: 'Accompanying Relations', key: 'accompanyingRelations', width: 25 },
      { header: 'Nationality', key: 'nationality', width: 15 },
      { header: 'Purpose of Visit', key: 'purposeOfVisit', width: 20 },
      { header: 'Occupation', key: 'occupation', width: 15 },
      { header: 'Coming From', key: 'comingFrom', width: 20 },
      { header: 'Going To', key: 'goingTo', width: 20 },
      { header: 'Full Address', key: 'fullAddress', width: 30 },
      { header: 'Male', key: 'male', width: 8 },
      { header: 'Female', key: 'female', width: 8 },
      { header: 'Boys', key: 'boys', width: 8 },
      { header: 'Girls', key: 'girls', width: 8 },
      { header: 'Departure Date', key: 'departureDate', width: 15 },
      { header: 'Departure Time', key: 'departureTime', width: 15 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Vehicle No', key: 'vehicleNumber', width: 15 },
      { header: 'Aadhaar Image Links', key: 'aadharImages', width: 40 },
    ];

    guests.forEach(g => {
      worksheet.addRow({
        sno: g.sno,
        arrivalDate: g.arrivalDate,
        arrivalTime: g.arrivalTime,
        roomNumber: g.roomNumber,
        name: g.name,
        fatherName: g.fatherName,
        age: g.age,
        accompanyingNames: g.accompanyingNames,
        accompanyingRelations: g.accompanyingRelations,
        nationality: g.nationality,
        purposeOfVisit: g.purposeOfVisit,
        occupation: g.occupation,
        comingFrom: g.comingFrom,
        goingTo: g.goingTo,
        fullAddress: g.fullAddress,
        male: g.numberOfPersons?.male,
        female: g.numberOfPersons?.female,
        boys: g.numberOfPersons?.boys,
        girls: g.numberOfPersons?.girls,
        departureDate: g.departureDate,
        departureTime: g.departureTime,
        phone: g.phone,
        vehicleNumber: g.vehicleNumber,
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

  const editableFields = ['name', 'roomNumber', 'phone', 'vehicleNumber', 'departureDate', 'departureTime'];

  const tableHeaders = [
    'S.No', 'Arrival Date', 'Arrival Time', 'Room No', 'Name', 'Phone',
    'Departure Date', 'Departure Time', 'Aadhaar', 'Actions'
  ];

  return (
    <div className="w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/back.jpg')" }}>
      <nav className="flex justify-between items-center mb-4 bg-slate-900 p-4 rounded-xl">
        <h1 className="text-3xl font-bold text-white">
          Guest Records <span className="text-[#FF5C00]">{hotelName && `of ${hotelName}`}</span>
        </h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/add")} className="btn btn-primary">Add Guest</button>
          <button onClick={exportToExcel} className="btn btn-secondary">Export</button>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-[#874f41] text-white p-4 rounded-lg mb-4">
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Filter by name"
            className="p-2 rounded text-black"
            value={filters.name}
            onChange={e => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            type="date"
            placeholder="Filter by date"
            className="p-2 rounded text-black"
            value={filters.date}
            onChange={e => setFilters({ ...filters, date: e.target.value })}
          />
          <input
            type="month"
            placeholder="Filter by month"
            className="p-2 rounded text-black"
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: e.target.value })}
          />
          <button onClick={fetchGuests} className="bg-[#244855] px-4 py-2 rounded font-bold">
            Apply
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editData && (
        <form onSubmit={handleUpdate} className="bg-white p-4 rounded-lg mb-4 shadow">
          <h2 className="text-xl font-bold mb-2">Edit Guest</h2>
          {editableFields.map(key => (
            <input
              key={key}
              className="block mb-2 p-2 border w-full"
              type={key.includes('Date') ? 'date' : 'text'}
              placeholder={key}
              value={editData[key] || ''}
              onChange={e => setEditData({ ...editData, [key]: e.target.value })}
            />
          ))}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={() => setEditData(null)} className="ml-2 px-4 py-2 border rounded">Cancel</button>
        </form>
      )}

      {/* Guest Table */}
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
                <td className="px-4 py-2">{g.phone}</td>
                <td className="px-4 py-2">{g.departureDate}</td>
                <td className="px-4 py-2">{g.departureTime}</td>
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
    </div>
  );
}
