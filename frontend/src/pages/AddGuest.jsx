import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddGuest() {
  const [form, setForm] = useState({
    name: '',
    numberOfGuests: '',
    phone: '',
    city: '',
    state: '',
    price: '',
    checkIn: '',
    checkOut: '',
    roomNumber: '',
  });
  const [aadharImage, setAadharImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append('aadharImage', aadharImage);

    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/guests/', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Guest added!');
      navigate('/dashboard');
    } catch (err) {
      alert('Error adding guest');
      console.error(err);
    }
  };

  return (
    <div className="bg-[#FBE9D0] min-h-screen py-10 px-4 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-6 bg-[#90AEAD] border-4 border-[#874f41] rounded-2xl shadow-lg"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#244855]">Add Guest</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Number of Guests"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, numberOfGuests: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Room Number"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, roomNumber: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="City"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="State"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, state: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Check-in Date"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, checkIn: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Check-out Date"
            className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, checkOut: e.target.value })}
          />

          <label className="block font-bold ">Upload Aadhaar Image:</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded p-2"
            onChange={e => setAadharImage(e.target.files[0])}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#244855] text-white py-2 rounded-full font-bold text-lg hover:bg-[#385d68] active:bg-[#2c4a4f]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
