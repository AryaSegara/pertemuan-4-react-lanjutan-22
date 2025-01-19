import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);
  const [gmail, setGmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [profile, setProfile] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Register new user
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        { gmail, username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Registration successful!');
      setGmail('');
      setUsername('');
      setPassword('');
      setShowRegister(false);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed.');
    }
  };

  // Login user
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const userToken = response.data.token;
      setToken(userToken);
      localStorage.setItem('token', userToken);
      alert('Login successful!');
      setShowLogin(false);
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed.');
    }
  };

  // Logout user
  const logoutUser = () => {
    setToken('');
    localStorage.removeItem('token');
    setProfile(null);
    alert('Logged out successfully.');
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch profile. Please login first.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          User Management with Authentication
        </h1>

        {/* Buttons to Show/Hide Forms */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-500 transition-all"
          >
            {showRegister ? 'Close Register' : 'Register'}
          </button>
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-500 transition-all"
          >
            {showLogin ? 'Close Login' : 'Login'}
          </button>
          {token && (
            <button
              onClick={logoutUser}
              className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-500 transition-all"
            >
              Logout
            </button>
          )}
        </div>

        {/* Register Form */}
        {showRegister && (
          <form
            onSubmit={registerUser}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <h2 className="text-xl font-bold text-blue-500">Register</h2>
            <input
              type="email"
              placeholder="Enter Gmail"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-500 transition-all"
            >
              Register
            </button>
          </form>
        )}

        {/* Login Form */}
        {showLogin && (
          <form
            onSubmit={loginUser}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <h2 className="text-xl font-bold text-green-500">Login</h2>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 outline-none"
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-300 outline-none"
            />
            <button
              type="submit"
              className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-500 transition-all"
            >
              Login
            </button>
          </form>
        )}

        {/* Fetch Profile */}
        {token && (
          <div className="text-center">
            <button
              onClick={fetchProfile}
              className="bg-purple-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-purple-500 transition-all"
            >
              Fetch Profile
            </button>
          </div>
        )}

        {/* Display Profile */}
        {profile && (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md w-80 mx-auto">
            <h2 className="text-lg font-bold mb-2 text-purple-700">Profile Information</h2>
            <p className="mb-2">
              <span className="font-semibold">Gmail:</span> {profile.gmail}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Username:</span> {profile.username}
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          &copy; 2025 User Management with Authentication
        </footer>
      </div>
    </div>
  );
};

export default App;
