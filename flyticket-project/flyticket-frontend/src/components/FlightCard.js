import React from 'react';

export default function FlightCard({ flight, onBook }) {
    return (
        <div className="bg-white p-6 mb-4 rounded-xl shadow-md flex justify-between items-center border-l-8 border-blue-500">
            <div>
                <span className="text-gray-400 text-xs font-bold uppercase">{flight.flight_id}</span>
                <h3 className="text-xl font-bold text-gray-800">{flight.from_city_name} ➔ {flight.to_city_name}</h3>
                <p className="text-gray-500">Kalkış: {new Date(flight.departure_time).toLocaleString('tr-TR')}</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-blue-600">{flight.price} TL</p>
                <p className="text-sm text-green-600 font-bold">Koltuk: {flight.seats_available}</p>
                <button 
                    onClick={() => onBook(flight.flight_id)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-2 hover:bg-blue-800 transition font-bold"
                >
                    Bilet Al
                </button>
            </div>
        </div>
    );
}