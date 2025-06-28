import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ hotelName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.hotelName || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('https://hotelguest-pro-5agn.onrender.com/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <nav className='bg-slate-900 text-[#FF5C00] p-4 h-[10vh] flex gap-2'>
        <img src="hotelicon.png" className='w-12 rounded-full' alt="" />
        <h1 className='text-3xl font-bold'>HotelGuest Pro</h1>
      </nav>

      <div className='flex items-center justify-center min-h-[90vh] bg-cover bg-center ' style={{ backgroundImage: "url('back.jpg')" }}>
        <form
          onSubmit={handleRegister}
          className="max-w-md mx-auto mt-10 p-6 shadow bg-[#90AEAD] border-4 border-[#874f41] rounded-2xl"
        >
          <h2 className="text-2xl font-extrabold mb-4">Register</h2>

          {error && <p className="mb-3 text-red-600">{error}</p>}

          <input
            type="text"
            placeholder="Hotel Name"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-[#244855] text-white font-bold text-lg py-2 rounded">
            Register
          </button>

          <p className="mt-4 text-center text-lg">
            Already registered?{' '}
            <Link to="/login" className="text-[#874f41] underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
