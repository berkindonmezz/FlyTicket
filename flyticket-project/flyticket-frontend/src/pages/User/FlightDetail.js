import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ticketService } from '../../services/api';

export default function FlightDetail() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation(); 

    const flightInfo = location.state?.flight;
    
    // Yolcu ve bilet state'leri
    const [passengerData, setPassengerData] = useState({
        passenger_name: '',
        passenger_surname: '',
        passenger_email: ''
    });
    
    // Koltuk state'leri
    const [bookedSeats, setBookedSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [loading, setLoading] = useState(false);

    // Sayfa yüklendiğinde dolu koltukları backend'den çek
    useEffect(() => {
        const fetchBookedSeats = async () => {
            try {
                // Kendi API portuna ve yapına göre gerekirse burayı düzelt
                const response = await fetch(`http://localhost:5000/api/tickets/flight/${id}/seats`);
                if (response.ok) {
                    const data = await response.json();
                    setBookedSeats(data); // Örn: ['1A', '2C', '14F']
                }
            } catch (error) {
                console.error("Dolu koltuklar çekilirken hata oluştu:", error);
            }
        };

        if (id) {
            fetchBookedSeats();
        }
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        
        // Koltuk seçilmediyse işlemi durdur
        if (!selectedSeat) {
            alert("Lütfen uçak haritasından bir koltuk seçiniz!");
            return;
        }

        setLoading(true);

        try {
            // Seçilen koltuğu da backend'e gönderilen veriye ekliyoruz
            const dataToSend = {
                flight_id: id,
                seat_number: selectedSeat,
                ...passengerData
            };

            const res = await ticketService.bookTicket(dataToSend);
            
            navigate('/booking-confirmation', { 
                state: { 
                    passengerData: passengerData, 
                    flightId: id, 
                    seatNumber: selectedSeat, // Artık rastgele değil, seçilen koltuk gidiyor
                    flightDetails: flightInfo || { 
                        from_city: 'İST', 
                        to_city: 'ANK', 
                        departure_time: new Date().toISOString() 
                    } 
                } 
            });
        } catch (error) {
            console.error("Error booking ticket:", error);
            // Backend'den eşzamanlılık (Unique) hatası gelirse kullanıcıyı uyar
            if (error.response && error.response.status === 400) {
                alert("Seçtiğiniz koltuk az önce satılmış olabilir. Lütfen başka bir koltuk seçin.");
                // Dolu koltukları güncelleyip seçimi sıfırla
                setSelectedSeat('');
                window.location.reload(); 
            } else {
                alert("Rezervasyon başarısız. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Koltuk haritası için satır ve sütun tanımları (Örnek 15 Satır)
    const rows = Array.from({ length: 15 }, (_, i) => i + 1);
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row items-start justify-center p-4 gap-8">
            
            {/* SOL TARAF: Yolcu Formu */}
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Passenger Information</h2>
                
                <form onSubmit={handleBooking} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={passengerData.passenger_name}
                            onChange={(e) => setPassengerData({...passengerData, passenger_name: e.target.value.toUpperCase()})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={passengerData.passenger_surname}
                            onChange={(e) => setPassengerData({...passengerData, passenger_surname: e.target.value.toUpperCase()})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={passengerData.passenger_email}
                            onChange={(e) => setPassengerData({...passengerData, passenger_email: e.target.value})}
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 flex justify-between items-center mt-2">
                        <span className="font-bold text-blue-800">Selected Seat:</span>
                        <span className="text-2xl font-black text-blue-600">{selectedSeat || '-'}</span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-2 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition font-black text-lg disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>

            {/* SAĞ TARAF: Koltuk Seçim Haritası */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border-t-4 border-gray-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 text-center">Select Your Seat</h2>
                
                {/* Uçak Ön Kısmı (Kokpit Göstergesi) */}
                <div className="w-full h-12 bg-gray-200 rounded-t-full mb-8 flex justify-center items-center">
                    <span className="text-gray-500 font-bold text-sm">FRONT</span>
                </div>

                <div className="flex flex-col gap-3 items-center">
                    {rows.map(row => (
                        <div key={row} className="flex gap-2 items-center">
                            {/* Sol Koltuklar (A, B, C) */}
                            <div className="flex gap-2">
                                {cols.slice(0, 3).map(col => {
                                    const seatNo = `${row}${col}`;
                                    const isBooked = bookedSeats.includes(seatNo);
                                    const isSelected = selectedSeat === seatNo;

                                    return (
                                        <button
                                            key={seatNo}
                                            type="button"
                                            disabled={isBooked}
                                            onClick={() => setSelectedSeat(seatNo)}
                                            className={`w-10 h-10 rounded-t-md rounded-b-sm font-bold text-xs flex items-center justify-center transition-all shadow-sm
                                                ${isBooked 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400' 
                                                    : isSelected 
                                                        ? 'bg-green-500 text-white border-green-700 ring-2 ring-green-300 transform scale-110' 
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300 cursor-pointer'} 
                                                border-b-4`}
                                        >
                                            {seatNo}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Koridor Numara Göstergesi */}
                            <div className="w-6 flex justify-center items-center">
                                <span className="text-gray-400 font-bold text-sm">{row}</span>
                            </div>

                            {/* Sağ Koltuklar (D, E, F) */}
                            <div className="flex gap-2">
                                {cols.slice(3, 6).map(col => {
                                    const seatNo = `${row}${col}`;
                                    const isBooked = bookedSeats.includes(seatNo);
                                    const isSelected = selectedSeat === seatNo;

                                    return (
                                        <button
                                            key={seatNo}
                                            type="button"
                                            disabled={isBooked}
                                            onClick={() => setSelectedSeat(seatNo)}
                                            className={`w-10 h-10 rounded-t-md rounded-b-sm font-bold text-xs flex items-center justify-center transition-all shadow-sm
                                                ${isBooked 
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400' 
                                                    : isSelected 
                                                        ? 'bg-green-500 text-white border-green-700 ring-2 ring-green-300 transform scale-110' 
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300 cursor-pointer'} 
                                                border-b-4`}
                                        >
                                            {seatNo}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
}