import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { passengerData, flightId, seatNumber, flightDetails } = location.state || {};

    if (!passengerData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full border-t-4 border-red-500">
                    <span className="text-4xl mb-4 block">⚠️</span>
                    <p className="text-red-500 mb-6 font-bold">Ticket information not found or session expired.</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-bold shadow-sm"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleDownload = () => {
        window.print();
    };
    const fromCity = flightDetails?.from_city || "İST";
    const toCity = flightDetails?.to_city || "ANK";
    const departureTime = flightDetails?.departure_time || new Date().toISOString();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full">
                
                {/* Top confirmation message */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-4 border-white">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Booking Successful!</h1>
                    <p className="text-gray-500 mt-2 font-medium">Your e-ticket has been saved and emailed to you.</p>
                </div>

                {/* Ticket Card (Boarding Pass Layout) */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    
                    {/* Ticket Top: Route */}
                    <div className="bg-blue-600 p-6 text-white flex justify-between items-center relative">
                        <div className="text-center w-1/3">
                            <span className="block text-4xl font-black uppercase tracking-wider">{fromCity.substring(0, 3)}</span>
                            <span className="block text-sm font-medium opacity-80 mt-1">{fromCity}</span>
                        </div>
                        
                        <div className="w-1/3 flex flex-col items-center">
                            <span className="text-3xl mb-1">✈️</span>
                            <span className="text-[10px] font-black bg-white text-blue-600 px-3 py-1 rounded-full tracking-widest">
                                    ONE WAY
                            </span>
                        </div>
                        
                        <div className="text-center w-1/3">
                            <span className="block text-4xl font-black uppercase tracking-wider">{toCity.substring(0, 3)}</span>
                            <span className="block text-sm font-medium opacity-80 mt-1">{toCity}</span>
                        </div>
                    </div>

                    {/* Dashed Divider */}
                    <div className="relative h-8 bg-white flex items-center justify-between px-[-10px] -my-4 z-10">
                        <div className="w-8 h-8 bg-gray-100 rounded-full -ml-4 shadow-inner"></div>
                        <div className="w-full border-t-2 border-dashed border-gray-300 mx-2"></div>
                        <div className="w-8 h-8 bg-gray-100 rounded-full -mr-4 shadow-inner"></div>
                    </div>

                    {/* Ticket Bottom: Passenger Details */}
                    <div className="p-6 pt-8 bg-white">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                            <div>
                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Passenger</span>
                                <span className="block text-gray-800 font-black text-lg uppercase leading-tight">
                                    {passengerData.passenger_name} {passengerData.passenger_surname}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date / Time</span>
                                <span className="block text-gray-800 font-bold text-md leading-tight">
                                    {new Date(departureTime).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</span>
                                <span className="block text-gray-800 font-bold text-sm truncate">{passengerData.passenger_email}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PNR / Flight Code</span>
                                <span className="block text-gray-800 font-black text-lg">#{flightId}</span>
                            </div>
                        </div>

                        {/* Seat Number Highlight */}
                        {seatNumber && (
                            <div className="bg-blue-50 rounded-xl p-4 flex justify-between items-center border border-blue-200 shadow-sm">
                                <span className="font-black text-blue-800 uppercase tracking-wider text-sm">Seat No:</span>
                                <span className="text-4xl font-black text-blue-600">{seatNumber}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-widest">Wishing you a pleasant and safe flight</p>
                    
                    {/* Action Buttons (hidden during print using print:hidden) */}
                    <div className="flex flex-col gap-3 print:hidden">
                        <button 
                            onClick={handleDownload}
                            className="w-full bg-gray-900 text-white font-black p-4 rounded-xl hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>🖨️</span> Download / Print E-Ticket
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-white text-blue-600 border-2 border-blue-100 font-black p-4 rounded-xl hover:bg-blue-50 transition shadow-sm"
                        >
                            Search New Flights
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}