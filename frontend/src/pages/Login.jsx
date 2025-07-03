import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      const res = await axios.post('https://hotelguest-pro-5agn.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className='bg-slate-900 text-[#FF5C00] p-4 h-[10vh] flex items-center gap-3 shadow-md'>
        <img src="hotelicon.png" className='w-10 h-10 rounded-full object-cover' alt="Hotel Icon" />
        <h1 className='text-2xl sm:text-3xl font-bold tracking-wide'>HotelGuest Pro</h1>
      </nav>

      {/* Background Section */}
      <div
        className="flex items-center justify-center min-h-[90vh] bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/back.jpg')" }}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-8 sm:p-10 bg-[#90AEAD] bg-opacity-95 border-4 border-[#874f41] rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#244855] mb-2">Welcome Back</h2>
          <p className="text-center text-sm sm:text-base mb-6 text-[#874f41] font-medium">Log in to continue</p>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-400 p-2 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-[#244855] rounded focus:outline-none focus:ring-2 focus:ring-[#244855]"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-3 border border-[#244855] rounded focus:outline-none focus:ring-2 focus:ring-[#244855]"
            onChange={e => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-[#244855] hover:bg-[#1a343e] transition duration-300 text-white text-lg font-semibold py-3 rounded-lg"
          >
            Login
          </button>

          <p className="mt-6 text-center text-base">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#874f41] underline font-semibold hover:text-[#6c3c31]">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
