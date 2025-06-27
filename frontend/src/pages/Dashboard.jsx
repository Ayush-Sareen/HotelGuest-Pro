import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import axios from 'axios';

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [filters, setFilters] = useState({ name: '', city: '', date: '', month: '' });
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  const fetchGuests = async () => {
    const token = localStorage.getItem('token');
    const query = new URLSearchParams(filters).toString();
    const url = query ? `https://hotelguest-pro-5agn.onrender.com/api/guests/filter?${query}` : `https://hotelguest-pro-5agn.onrender.com/api/guests`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGuests(res.data);
  };

  const fetchHotelName = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://hotelguest-pro-5agn.onrender.com/api/users/me', {
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
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Guests', key: 'guests', width: 10 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Check-In', key: 'checkIn', width: 15 },
      { header: 'Check-Out', key: 'checkOut', width: 15 },
      { header: 'Aadhar Image', key: 'aadharImage', width: 30 },
    ];

    for (const g of guests) {
      const row = worksheet.addRow({
        name: g.name,
        guests: g.numberOfGuests,
        phone: g.phone,
        city: g.city,
        state: g.state,
        price: g.price,
        checkIn: g.checkIn ? new Date(g.checkIn).toLocaleDateString() : '',
        checkOut: g.checkOut ? new Date(g.checkOut).toLocaleDateString() : '',
      });

      try {
        const response = await fetch(`https://hotelguest-pro-5agn.onrender.com/${g.aadharImage}`);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const imageId = workbook.addImage({
          buffer,
          extension: 'png',
        });

        worksheet.addImage(imageId, {
          tl: { col: 8, row: row.number - 1 },
          ext: { width: 100, height: 100 },
        });

        worksheet.getRow(row.number).height = 80;
      } catch (error) {
        console.error("Image fetch error:", error);
        worksheet.getCell(`I${row.number}`).value = `https://hotelguest-pro-5agn.onrender.com/${g.aadharImage}`;
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

  const editFields = [
    { key: 'name', type: 'text' },
    { key: 'numberOfGuests', type: 'number' },
    { key: 'roomNumber', type: 'text' },
    { key: 'phone', type: 'text' },
    { key: 'city', type: 'text' },
    { key: 'state', type: 'text' },
    { key: 'price', type: 'number' },
    { key: 'checkIn', type: 'date' },
    { key: 'checkOut', type: 'date' }
  ];

  const tableHeaders = [
    'Name', 'Guests','Room No', 'Phone', 'City', 'State', 'Price',
    'Check-in', 'Check-out', 'Aadhar', 'Actions'
  ];

  return (
    <div className="bg-[#fbe9d0] w-full min-h-screen">
      <nav className="flex justify-between items-center mb-4 bg-slate-900 p-4">
        <h1 className="text-3xl font-bold text-white">Guest Records <p className='text-[#FF5C00]'>{hotelName && `of ${hotelName}`}</p></h1>
        <div className="space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
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

      {/* Filters */}
      <div className="flex flex-col border-4 border-[#244855] p-4 rounded-2xl mb-4 w-3/4 mx-auto bg-[#874f41] text-[#FBE9D0] ">
        <h1 className="text-2xl font-bold mb-4 text-center">Filters</h1>
        <div className=" flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
          <div className="flex flex-col justify-center items-center text-lg font-bold">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Filter by name"
              className="p-2 border rounded"
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col justify-center items-center text-lg font-bold">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              placeholder="Filter by date"
              className="p-2 border rounded"
              value={filters.date}
              onChange={e => setFilters({ ...filters, date: e.target.value })}
            />
          </div>
          <div className="flex flex-col justify-center items-center text-lg font-bold">
            <label htmlFor="month">Month</label>
            <input
              type="month"
              placeholder="Filter by month"
              className="p-2 border rounded"
              value={filters.month}
              onChange={e => setFilters({ ...filters, month: e.target.value })}
            />
          </div>
        </div>
        <button onClick={fetchGuests} className="col-span-full bg-[#244855] text-white py-2 rounded-full border-2 border-[#fbe9d0] hover:bg-[#385d68] active:bg-[#2c4a4f] text-lg font-bold">Apply Filters</button>
      </div>

      {/* Edit Form */}
      {editData && (
        <form onSubmit={handleUpdate} className="bg-[#fbe9d0] p-4 rounded mb-4">
          <h2 className="text-xl font-bold mb-2">Edit Guest</h2>
          {editFields.map(({ key, type }) => (
            <input
              key={key}
              className="block mb-2 p-2 border w-full"
              type={type}
              placeholder={key}
              value={
                type === 'date' && editData[key]
                  ? editData[key].split("T")[0]
                  : editData[key] || ''
              }
              onChange={e => setEditData({ ...editData, [key]: e.target.value })}
            />
          ))}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button type="button" className="ml-2 px-4 py-2 border rounded" onClick={() => setEditData(null)}>Cancel</button>
        </form>
      )}

      {/* Guest Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-[#244855] border-4 rounded-lg">
          <thead>
            <tr className="bg-[#874f41] text-white">
              {tableHeaders.map(header => (
                <th key={header} className="px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guests.map((g, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{g.name}</td>
                <td className="px-4 py-2">{g.numberOfGuests}</td>
                <td className="px-4 py-2">{g.roomNumber}</td>
                <td className="px-4 py-2">{g.phone}</td>
                <td className="px-4 py-2">{g.city}</td>
                <td className="px-4 py-2">{g.state}</td>
                <td className="px-4 py-2">₹{g.price}</td>
                <td className="px-4 py-2">{g.checkIn ? new Date(g.checkIn).toISOString().split('T')[0] : '—'}</td>
                <td className="px-4 py-2">{g.checkOut ? new Date(g.checkOut).toISOString().split('T')[0] : '—'}</td>
                <td className="px-4 py-2">
                  <a
                    href={`https://hotelguest-pro-5agn.onrender.com/${g.aadharImage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => setEditData(g)} className="text-yellow-600 hover:underline">Edit</button>
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
