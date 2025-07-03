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

    for (const [i, g] of guests.entries()) {
      worksheet.addRow({
        sno: i + 1, // ✅ auto-generated serial number
        ...g,
        male: g.numberOfPersons?.male,
        female: g.numberOfPersons?.female,
        boys: g.numberOfPersons?.boys,
        girls: g.numberOfPersons?.girls,
        aadharImages: '',
      });

      if (Array.isArray(g.aadharImages)) {
        for (const [imgIndex, imgUrl] of g.aadharImages.entries()) {
          try {
            const res = await axios.get(imgUrl, { responseType: 'arraybuffer' });
            const imageId = workbook.addImage({
              buffer: res.data,
              extension: 'jpeg',
            });

            worksheet.addImage(imageId, {
              tl: { col: 23, row: i + 1 },
              ext: { width: 100, height: 100 },
            });
          } catch (err) {
            console.error('Error downloading Aadhaar image:', err.message);
          }
        }
      }
    }

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
    <div className="w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/back.jpg')" }}>
      <nav className="flex justify-between items-center mb-4 bg-slate-900 p-4 rounded-xl">
        <h1 className="text-3xl font-bold text-white">
          Guest Records <span className="text-[#FF5C00]">{hotelName && `of ${hotelName}`}</span>
        </h1>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => navigate("/add")} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            <span className=" text-lg relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Add Guest
            </span>
          </button>
          <button onClick={exportToExcel} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-lg">
              Export to Excel
            </span>
          </button>
          <button type="button" onClick={handleLogout} className="text-red-700 hover:text-white border text-lg border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">LogOut</button>
        </div>
      </nav>

      {/* Filter Section */}
      <div className="bg-[#874f41] text-white p-6 rounded-lg mb-4 mx-2 sm:mx-4 md:mx-8">
        <h2 className="text-2xl font-semibold mb-4">Filter Guest Records</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Guest Name</label>
            <input
              type="text"
              placeholder="e.g., John"
              className="p-2 w-full rounded-4xl text-black border-2"
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Arrival Date</label>
            <input
              type="date"
              className="p-2 w-full rounded-4xl text-black border-2"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Arrival Month</label>
            <input
              type="month"
              className="p-2 w-full text-black border-2 rounded-4xl"
              value={filters.month}
              onChange={e => setFilters({ ...filters, month: e.target.value })}
            />
          </div>
        </div>
        <button
          onClick={fetchGuests}
          className="mt-6 bg-[#244855] hover:bg-[#1a343e] px-6 py-2 text-white font-bold text-base rounded transition"
        >
          Apply Filters
        </button>
      </div>

      {/* Edit Form */}
      {editData && (
        <form onSubmit={handleUpdate} className="bg-white p-4 rounded-lg mb-4 shadow mx-2 sm:mx-4 md:mx-8">
          <h2 className="text-xl font-bold mb-2">Edit Guest</h2>
          {Object.keys(editData).map(key => (
            typeof editData[key] === 'string' && (
              <input
                key={key}
                className="block mb-2 p-2 border w-full"
                type="text"
                placeholder={key}
                value={editData[key] || ''}
                onChange={e => setEditData({ ...editData, [key]: e.target.value })}
              />
            )
          ))}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={() => setEditData(null)} className="ml-2 px-4 py-2 border rounded">Cancel</button>
        </form>
      )}

      {/* Guest Table */}
      <div className="overflow-x-auto mx-2 sm:mx-4 md:mx-8 mb-8">
        <table className="table-auto w-full border border-gray-400 border-collapse">
          <thead className="bg-[#244855] text-white text-sm">
            <tr>
              {tableHeaders.map(h => <th key={h} className="px-4 py-2 whitespace-nowrap border border-gray-400">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i} className="border-t text-sm bg-white bg-opacity-90">
                <td className="px-4 py-2 border border-gray-400">{i + 1}</td>
                <td className="px-4 py-2 border border-gray-400">{g.arrivalDate}</td>
                <td className="px-4 py-2 border border-gray-400">{g.arrivalTime}</td>
                <td className="px-4 py-2 border border-gray-400">{g.roomNumber}</td>
                <td className="px-4 py-2 border border-gray-400">{g.name}</td>
                <td className="px-4 py-2 border border-gray-400">{g.fatherName}</td>
                <td className="px-4 py-2 border border-gray-400">{g.age}</td>
                <td className="px-4 py-2 border border-gray-400">{g.accompanyingNames}</td>
                <td className="px-4 py-2 border border-gray-400">{g.accompanyingRelations}</td>
                <td className="px-4 py-2 border border-gray-400">{g.nationality}</td>
                <td className="px-4 py-2 border border-gray-400">{g.purposeOfVisit}</td>
                <td className="px-4 py-2 border border-gray-400">{g.occupation}</td>
                <td className="px-4 py-2 border border-gray-400">{g.comingFrom}</td>
                <td className="px-4 py-2 border border-gray-400">{g.goingTo}</td>
                <td className="px-4 py-2 border border-gray-400">{g.fullAddress}</td>
                <td className="px-4 py-2 border border-gray-400">{g.departureDate}</td>
                <td className="px-4 py-2 border border-gray-400">{g.departureTime}</td>
                <td className="px-4 py-2 border border-gray-400">{g.phone}</td>
                <td className="px-4 py-2 border border-gray-400">{g.vehicleNumber}</td>
                <td className="px-4 py-2 border border-gray-400">{g.numberOfPersons?.male}</td>
                <td className="px-4 py-2 border border-gray-400">{g.numberOfPersons?.female}</td>
                <td className="px-4 py-2 border border-gray-400">{g.numberOfPersons?.boys}</td>
                <td className="px-4 py-2 border border-gray-400">{g.numberOfPersons?.girls}</td>
                <td className="px-4 py-2 border border-gray-400">
                  {g.aadharImages?.map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline block">
                      Aadhaar {idx + 1}
                    </a>
                  ))}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button onClick={() => setEditData(g)} className="text-yellow-600 hover:underline mr-2">Edit</button>
                  <button
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      if (confirm("Are you sure you want to delete this guest?")) {
                        await axios.delete(`https://hotelguest-pro-5agn.onrender.com/api/guests/${g._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        fetchGuests();
                      }
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
