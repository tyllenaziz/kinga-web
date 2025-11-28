import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// URL of your Live Render Backend
const API_URL = 'https://kinga-backend.onrender.com';

function App() {
  const [token, setToken] = useState(localStorage.getItem('user_id'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      setToken(res.data.user_id);
      localStorage.setItem('user_id', res.data.user_id);
      alert("Welcome " + res.data.name);
      fetchHistory();
    } catch (err) {
      alert("Login Failed");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('user_id');
  };

  // --- FETCH DATA ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load history automatically if logged in
  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  // --- RENDER LOGIN PAGE ---
  if (!token) {
    return (
      <div className="container" style={{maxWidth: '400px', marginTop: '100px'}}>
        <div className="card">
          <h2 style={{color: '#1b5e20', textAlign: 'center'}}>Kinga Admin</h2>
          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            
            <button type="submit" className="btn" style={{width: '100%'}}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div>
      <div className="navbar">
        <h2>🌱 Kinga Dashboard</h2>
        <button onClick={handleLogout} style={{background:'transparent', border:'1px solid white', color:'white', padding:'5px 10px', cursor:'pointer'}}>Logout</button>
      </div>

      <div className="container">
        
        {/* STATS CARDS */}
        <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
          <div className="card" style={{flex: 1, textAlign: 'center'}}>
            <h3>Total Scans</h3>
            <h1 style={{color: '#1b5e20', fontSize: '3rem', margin: '10px 0'}}>{history.length}</h1>
          </div>
          <div className="card" style={{flex: 1, textAlign: 'center'}}>
            <h3>Status</h3>
            <p style={{color: 'green', fontWeight: 'bold'}}>System Online</p>
          </div>
        </div>

        {/* HISTORY TABLE */}
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3>Recent Activity</h3>
            <button onClick={fetchHistory} className="btn" style={{padding:'5px 10px', fontSize:'0.8rem'}}>Refresh</button>
          </div>

          {loading ? <p>Loading data...</p> : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pest Detected</th>
                  <th>Swahili Name</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.name}</td>
                    <td>{item.swahili_name}</td>
                    <td>
                      <span className={item.confidence.includes('(Low)') ? 'status-orange' : 'status-green'}>
                        {item.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default App