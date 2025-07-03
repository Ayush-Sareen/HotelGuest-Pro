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
      {/* Navbar */}
      <nav className='bg-slate-900 text-[#FF5C00] p-4 h-[10vh] flex items-center gap-3 shadow-md'>
        <img src="hotelicon.png" className='w-10 h-10 rounded-full object-cover' alt="Hotel Icon" />
        <h1 className='text-2xl sm:text-3xl font-bold tracking-wide'>HotelGuest Pro</h1>
      </nav>

      {/* Registration Form Section */}
      <div
        className='flex items-center justify-center min-h-[90vh] bg-cover bg-center px-4'
        style={{ backgroundImage: "url('/back.jpg')" }}
      >
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md p-8 sm:p-10 bg-[#90AEAD] bg-opacity-95 border-4 border-[#874f41] rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#244855] mb-2">Create Account</h2>
          <p className="text-center text-sm sm:text-base mb-6 text-[#874f41] font-medium">
            Start managing your hotel guests
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-400 p-2 rounded">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Hotel Name"
            className="w-full mb-4 p-3 border border-[#244855] rounded focus:outline-none focus:ring-2 focus:ring-[#244855]"
            onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-[#244855] rounded focus:outline-none focus:ring-2 focus:ring-[#244855]"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border border-[#244855] rounded focus:outline-none focus:ring-2 focus:ring-[#244855]"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-[#244855] hover:bg-[#1a343e] transition duration-300 text-white text-lg font-semibold py-3 rounded-lg"
          >
            Register
          </button>

          <p className="mt-6 text-center text-base">
            Already registered?{' '}
            <Link to="/login" className="text-[#874f41] underline font-semibold hover:text-[#6c3c31]">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
