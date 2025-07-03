import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ Move Input outside the component to avoid redefinition on re-renders
const Input = ({ name, type = 'text', form, setForm, required = false }) => (
  <input
    type={type}
    name={name}
    required={required}
    placeholder={name.replace(/([A-Z])/g, ' $1')}
    className="w-full p-2 border rounded"
    value={form[name]}
    onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
  />
);

export default function AddGuest() {
  const [form, setForm] = useState({
    sno: '',
    arrivalDate: '',
    arrivalTime: '',
    roomNumber: '',
    name: '',
    fatherName: '',
    age: '',
    accompanyingNames: '',
    accompanyingRelations: '',
    nationality: '',
    purposeOfVisit: '',
    occupation: '',
    comingFrom: '',
    goingTo: '',
    fullAddress: '',
    phone: '',
    vehicleNumber: '',
    departureDate: '',
    departureTime: '',
    male: '',
    female: '',
    boys: '',
    girls: '',
  });

  const [aadharImages, setAadharImages] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAadharImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });
    aadharImages.forEach((file) => data.append('aadharImages', file));

    const token = localStorage.getItem('token');
    try {
      await axios.post('https://hotelguest-pro-5agn.onrender.com/api/guests/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
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
        className="w-full max-w-3xl p-6 bg-[#90AEAD] border-4 border-[#874f41] rounded-2xl shadow-lg space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-[#244855]">Add Guest</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabeledInput label="Arrival Date" name="arrivalDate" type="date" required form={form} setForm={setForm} />
          <LabeledInput label="Arrival Time" name="arrivalTime" type="time" required form={form} setForm={setForm} />
          <LabeledInput label="Room Number" name="roomNumber" required form={form} setForm={setForm} />
          <LabeledInput label="Guest Name" name="name" required form={form} setForm={setForm} />
          <LabeledInput label="Father's Name" name="fatherName" form={form} setForm={setForm} />
          <LabeledInput label="Age" name="age" type="number" form={form} setForm={setForm} />
          <LabeledInput label="Accompanying Names" name="accompanyingNames" form={form} setForm={setForm} />
          <LabeledInput label="Accompanying Relations" name="accompanyingRelations" form={form} setForm={setForm} />
          <LabeledInput label="Nationality" name="nationality" form={form} setForm={setForm} />
          <LabeledInput label="Purpose of Visit" name="purposeOfVisit" form={form} setForm={setForm} />
          <LabeledInput label="Occupation" name="occupation" form={form} setForm={setForm} />
          <LabeledInput label="Coming From" name="comingFrom" form={form} setForm={setForm} />
          <LabeledInput label="Going To" name="goingTo" form={form} setForm={setForm} />
          <LabeledInput label="Full Address" name="fullAddress" form={form} setForm={setForm} />
          <LabeledInput label="Departure Date" name="departureDate" type="date" form={form} setForm={setForm} />
          <LabeledInput label="Departure Time" name="departureTime" type="time" form={form} setForm={setForm} />
          <LabeledInput label="Phone Number" name="phone" form={form} setForm={setForm} />
          <LabeledInput label="Vehicle Number" name="vehicleNumber" form={form} setForm={setForm} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LabeledInput label="Male" name="male" type="number" form={form} setForm={setForm} />
          <LabeledInput label="Female" name="female" type="number" form={form} setForm={setForm} />
          <LabeledInput label="Boys" name="boys" type="number" form={form} setForm={setForm} />
          <LabeledInput label="Girls" name="girls" type="number" form={form} setForm={setForm} />
        </div>

        <div>
          <label className="block font-bold mb-1 text-[#244855]">Upload Aadhaar Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#244855] text-white py-2 rounded-full font-bold text-lg hover:bg-[#385d68] active:bg-[#2c4a4f]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
