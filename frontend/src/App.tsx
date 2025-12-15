import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import api from './services/api';

function App() {
  const { user, setUser, isLoading } = useAuth();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <Router>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/" className="text-white">
            Home
          </Link>
          <div>
            {isLoading ? (
              <p className="text-white">Loading...</p>
            ) : user ? (
              <>
                <Link to="/dashboard" className="text-white mr-4">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white mr-4">
                  Login
                </Link>
                <Link to="/register" className="text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;

