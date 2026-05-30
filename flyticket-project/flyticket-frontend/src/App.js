import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/User/Home';
import FlightDetail from './pages/User/FlightDetail';
import BookingConfirmation from './pages/User/BookingConfirmation'; // Yeni eklendi
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* USER TARAFI */}
        <Route path="/" element={<Home />} />
        {/* Bilet alma sayfası (parametre id olarak güncellendi) */}
        <Route path="/book/:id" element={<FlightDetail />} />
        {/* Başarılı bilet alımı sonrası onay sayfası */}
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        
        {/* ADMIN TARAFI */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;