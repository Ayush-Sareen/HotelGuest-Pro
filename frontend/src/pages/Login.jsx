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
    <nav className='bg-slate-900 text-[#FF5C00] p-4 h-[10vh] flex gap-2'>
      <img src="hotelicon.png" className='w-12 rounded-full' alt="" />
      <h1 className='text-3xl font-bold'>HotelGuest Pro</h1>
    </nav>
    <div className='flex items-center justify-center min-h-[90vh] bg-[#FBE9D0]'>
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 p-6 shadow bg-[#90AEAD] border-4 border-[#874f41] rounded-2xl">
      <h2 className="text-2xl font-extrabold mb-4">Login</h2>

      {error && <p className="mb-3 text-red-600">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border rounded"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit" className="w-full bg-[#244855] text-white text-lg font-bold py-2 rounded">
        Login
      </button>

      <p className="mt-4 text-center text-lg">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#874f41] underline">
          Register here
        </Link>
      </p>
    </form>
    </div>
    </>
  );
}
