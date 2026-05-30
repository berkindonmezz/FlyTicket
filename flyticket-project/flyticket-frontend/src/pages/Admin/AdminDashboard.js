import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService, adminFlightService, adminTicketService } from '../../services/api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('flights');
    const [flights, setFlights] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [cities, setCities] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFlight, setNewFlight] = useState({
        from_city: '', to_city: '', departure_time: '', arrival_time: '', price: '', seats_total: ''
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFlight, setEditFlight] = useState({
        flight_id: '', from_city: '', to_city: '', departure_time: '', arrival_time: '', price: '', seats_total: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        loadFlights();
        loadTickets();
        loadCities();
    }, [navigate]);

    const loadFlights = async () => {
        try {
              const res = await flightService.getAllFlights();
              console.log('RAW DATA FROM BACKEND:', res.data);
            setFlights(res.data);
        } catch (error) {
              console.error('Error loading flights:', error);
        }
    };

    const loadTickets = async () => {
        try {
              const res = await adminTicketService.getAllTickets();
              setTickets(res.data);
        } catch (error) {
              console.error('Error loading tickets:', error);
        }
    };

    const loadCities = async () => {
        try {
              const res = await flightService.getCities();
              setCities(res.data);
        } catch (error) {
              console.error('Error loading cities:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const handleDeleteFlight = async (flightId) => {
        if (window.confirm(`Are you sure you want to delete flight #${flightId}?`)) {
            try {
                await adminFlightService.deleteFlight(flightId);
                setFlights(flights.filter(f => f.flight_id !== flightId));
            } catch (error) {
                    alert('An error occurred while deleting the flight.');
            }
        }
    };

    const handleAddFlight = async (e) => {
        e.preventDefault();
        try {
            await adminFlightService.createFlight(newFlight);
                alert('Flight added successfully.');
            setIsModalOpen(false);
            loadFlights();
            setNewFlight({ from_city: '', to_city: '', departure_time: '', arrival_time: '', price: '', seats_total: '' });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                    alert('An error occurred while adding the flight.');
            }
        }
    };

    const formatForInput = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const openEditModal = (flight) => {
        setEditFlight({
            flight_id: flight.flight_id,
            from_city: flight.from_city,
            to_city: flight.to_city,
            departure_time: formatForInput(flight.departure_time),
            arrival_time: formatForInput(flight.arrival_time),
            price: flight.price,
            seats_total: flight.seats_total
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateFlight = async (e) => {
        e.preventDefault();
        try {
                await adminFlightService.updateFlight(editFlight.flight_id, {
                from_city: editFlight.from_city,
                to_city: editFlight.to_city,
                departure_time: editFlight.departure_time,
                arrival_time: editFlight.arrival_time,
                price: editFlight.price,
                seats_total: editFlight.seats_total
            });
                alert('Flight updated successfully.');
            setIsEditModalOpen(false);
            loadFlights(); 
        } catch (error) {
                alert('Update failed.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 relative">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-6">
                <h1 className="text-2xl font-black text-gray-800">Admin Dashboard</h1>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition">Log Out</button>
            </div>

            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('flights')} className={`px-6 py-2 font-bold rounded-md transition ${activeTab === 'flights' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>Flights</button>
                <button onClick={() => setActiveTab('tickets')} className={`px-6 py-2 font-bold rounded-md transition ${activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}>Reservations</button>
            </div>

            {activeTab === 'flights' ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Current Flights</h2>
            <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-700 transition">+ Add Flight</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-3">Flight ID</th>
                        <th className="p-3">Departure</th>
                        <th className="p-3">Arrival</th>
                        <th className="p-3">Departure Time</th>
                        <th className="p-3">Arrival Time</th>
                        <th className="p-3">Capacity</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                                {flights.map(flight => (
                                    <tr key={flight.flight_id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold text-gray-700">#{flight.flight_id}</td>
                                        <td className="p-3">
                                            {/* using from_city instead of from_city_name */}
                                            <span className="font-semibold text-blue-700">{flight.from_city}</span>
                                        </td>
                                        <td className="p-3">
                                            {/* using to_city instead of to_city_name */}
                                            <span className="font-semibold text-green-700">{flight.to_city}</span>
                                        </td>
                                        <td className="p-3 text-sm">
                                            {new Date(flight.departure_time).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-3 text-sm">
                                            {new Date(flight.arrival_time).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-3">
                                            {/* seats_total not provided; using seats_available for now */}
                                            <span className="bg-gray-100 px-2 py-1 rounded text-sm">{flight.seats_available ?? '?'} seats</span>
                                        </td>
                                        <td className="p-3 font-bold">{flight.price} TL</td>
                                        <td className="p-3 flex gap-2">
                                            <button onClick={() => openEditModal(flight)} className="text-blue-600 font-bold hover:underline">Edit</button>
                                            <button onClick={() => handleDeleteFlight(flight.flight_id)} className="text-red-600 font-bold hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
            </table>
        </div>
    </div>
) : (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">All Reservations</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b">
                                    <th className="p-3">Ticket ID</th>
                                    <th className="p-3">Passenger</th>
                                    <th className="p-3">Flight Code</th>
                                    <th className="p-3">Route</th>
                                    <th className="p-3">Departure Date</th>
                                    <th className="p-3">Seat No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets && tickets.length > 0 ? tickets.map(ticket => (
                                    <tr key={ticket.ticket_id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold text-gray-700">#{ticket.ticket_id}</td>
                                        <td className="p-3 uppercase">{ticket.passenger_name} {ticket.passenger_surname}</td>
                                        <td className="p-3 font-bold text-blue-600">{ticket.flight_id}</td>
                                        <td className="p-3">{ticket.from_city} ➔ {ticket.to_city}</td>
                                        <td className="p-3">{new Date(ticket.departure_time).toLocaleString('tr-TR')}</td>
                                        <td className="p-3 font-bold text-green-600">{ticket.seat_number}</td>
                                    </tr>
                                )) : <tr><td colSpan="6" className="p-4 text-center text-gray-500">No records.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* New Flight Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold">Add New Flight</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-red-500 font-bold text-xl">&times;</button>
                        </div>
                        <form onSubmit={handleAddFlight} className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Departure City</label>
                                    <select required className="w-full p-2 border rounded" value={newFlight.from_city} onChange={(e) => setNewFlight({...newFlight, from_city: e.target.value})}>
                                        <option value="">Select</option>
                                        {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Arrival City</label>
                                    <select required className="w-full p-2 border rounded" value={newFlight.to_city} onChange={(e) => setNewFlight({...newFlight, to_city: e.target.value})}>
                                        <option value="">Select</option>
                                        {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Departure Time</label>
                                    <input type="datetime-local" required className="w-full p-2 border rounded" value={newFlight.departure_time} onChange={(e) => setNewFlight({...newFlight, departure_time: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Arrival Time</label>
                                    <input type="datetime-local" required className="w-full p-2 border rounded" value={newFlight.arrival_time} onChange={(e) => setNewFlight({...newFlight, arrival_time: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Price (TL)</label>
                                    <input type="number" min="1" required className="w-full p-2 border rounded" value={newFlight.price} onChange={(e) => setNewFlight({...newFlight, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Total Seats</label>
                                    <input type="number" min="1" required className="w-full p-2 border rounded" value={newFlight.seats_total} onChange={(e) => setNewFlight({...newFlight, seats_total: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold p-3 rounded mt-2 hover:bg-blue-700 transition">Save Flight</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg border-t-4 border-blue-600">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold">Edit Flight (#{editFlight.flight_id})</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-red-500 font-bold text-xl">&times;</button>
                        </div>
                        <form onSubmit={handleUpdateFlight} className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Departure City</label>
                                    <select required className="w-full p-2 border rounded" value={editFlight.from_city} onChange={(e) => setEditFlight({...editFlight, from_city: e.target.value})}>
                                        <option value="">Select</option>
                                        {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Arrival City</label>
                                    <select required className="w-full p-2 border rounded" value={editFlight.to_city} onChange={(e) => setEditFlight({...editFlight, to_city: e.target.value})}>
                                        <option value="">Select</option>
                                        {cities.map(c => <option key={c.city_id} value={c.city_id}>{c.city_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Departure Time</label>
                                    <input type="datetime-local" required className="w-full p-2 border rounded" value={editFlight.departure_time} onChange={(e) => setEditFlight({...editFlight, departure_time: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Arrival Time</label>
                                    <input type="datetime-local" required className="w-full p-2 border rounded" value={editFlight.arrival_time} onChange={(e) => setEditFlight({...editFlight, arrival_time: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Price (TL)</label>
                                    <input type="number" min="1" required className="w-full p-2 border rounded" value={editFlight.price} onChange={(e) => setEditFlight({...editFlight, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Total Seats</label>
                                    <input type="number" min="1" required className="w-full p-2 border rounded" value={editFlight.seats_total} onChange={(e) => setEditFlight({...editFlight, seats_total: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold p-3 rounded mt-2 hover:bg-blue-700 transition">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}