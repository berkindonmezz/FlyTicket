import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { flightService } from '../../services/api'; 
import FlightCard from '../../components/FlightCard'; 

export default function Home() {
    const [cities, setCities] = useState([]);
    const [search, setSearch] = useState({ from: '', to: '', date: '' });
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        flightService.getCities()
            .then(res => setCities(res.data))
            .catch(err => console.error("Failed to load cities:", err));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setHasSearched(true);
        if (!search.from || !search.to || !search.date) {
            alert("Please fill out all fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await flightService.searchFlights(search.from, search.to, search.date);
            setFlights(res.data);
        } catch (err) {
            alert("An error occurred while searching for flights.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Top Navigation (Navbar) */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center w-full z-50 sticky top-0">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
                    <h1 className="text-2xl font-black text-blue-700 tracking-tight">FlyTicket</h1>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-blue-700 transform rotate-45">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>

                    <div className="pl-3 border-l-2 border-gray-300 hidden sm:block">
                        <span className="text-sm font-black text-blue-500 uppercase tracking-widest block leading-none mt-1">
                            Here to Make You Fly
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <span className="text-gray-500 font-medium hidden sm:block">Welcome</span>
                    <Link 
                        to="/admin/login" 
                        className="bg-gray-800 text-white px-5 py-2 rounded-lg font-bold hover:bg-gray-700 transition shadow-sm"
                    >
                        Admin Login
                    </Link>
                </div>
            </header>

            {/* VİDEOLU ANA ALAN (Hem Form Hem Sonuçlar Burada) */}
            <div className="relative w-full flex flex-col flex-grow min-h-[90vh]">
                
                {/* Arka Plan Videosu */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                >
                    <source src="/cloud.mp4" type="video/mp4" />
                </video>

                {/* Siyah Karartma Filtresi */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

                {/* İçerik (Z-index ile videonun üstünde) */}
                <div className="relative z-20 w-full flex flex-col items-center justify-center px-4 py-12 flex-grow">                    
                    {/* Başlık */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md">
                            Where do you want to fly?
                        </h2>
                        <p className="text-lg text-gray-200 max-w-2xl mx-auto drop-shadow-md font-medium">
                            Find the best flight among thousands in seconds and enjoy your trip.
                        </p>
                    </div>

                    {/* Arama Formu */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-5xl border border-gray-100">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end justify-between">
                            <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">From</label>
                                <select 
                                    className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm outline-none bg-gray-50"
                                    value={search.from}
                                    onChange={(e) => setSearch({...search, from: e.target.value})}
                                >
                                    <option value="">Select a city</option>
                                    {cities.map(city => (
                                        <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">To</label>
                                <select 
                                    className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm outline-none bg-gray-50"
                                    value={search.to}
                                    onChange={(e) => setSearch({...search, to: e.target.value})}
                                >
                                    <option value="">Select a city</option>
                                    {cities.map(city => (
                                        <option key={city.city_id} value={city.city_id}>{city.city_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Departure Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm outline-none bg-gray-50"
                                    value={search.date}
                                    onChange={(e) => setSearch({...search, date: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full md:w-auto md:px-12 p-3 md:p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-black shadow-md disabled:bg-gray-400 whitespace-nowrap text-lg"
                            >
                                {loading ? 'Searching...' : 'Search Flights'}
                            </button>
                        </form>
                    </div>

                    {/* ARAMA SONUÇLARI (Formun hemen altında, video üzerinde) */}
                    <main className="w-full max-w-5xl mt-12">
                        {flights.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">Available Flights</h3>
                                {flights.map(flight => (
                                    <FlightCard 
                                        key={flight.flight_id} 
                                        flight={flight} 
                                        onBook={(id) => navigate(`/book/${id}`)} 
                                    />
                                ))}
                            </div>
                        ) : (
                            !loading && hasSearched && flights.length === 0 && (
                                <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-red-100">
                                    <span className="text-4xl mb-4 block">📭</span>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Flights Found</h3>
                                    <p className="text-gray-500">
                                        There are no scheduled flights for this route on the selected date. Would you like to try a different date or route?
                                    </p>
                                </div>
                            )
                        )}
                    </main>

                </div>
            </div>

            {/* FOOTER BÖLÜMÜ (Videonun Altında) */}
            <footer className="bg-gray-900 text-gray-400 py-8 w-full z-20 relative">
                <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm">
                        © {new Date().getFullYear()} FlyTicket. Developed by Berkin Dönmez.
                    </div>
                    <div className="flex gap-6 text-sm font-medium">
                        <a 
                            href="https://github.com/berkindonmezz/FlyTicket" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:text-white transition flex items-center gap-1"
                        >
                            <span>&lt;/&gt;</span> Source Code
                        </a>
                        <a 
                            href="mailto:berkindonmez@outlook.com" 
                            className="hover:text-white transition flex items-center gap-1"
                        >
                            <span>✉</span> Contact
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}