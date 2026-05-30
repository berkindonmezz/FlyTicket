import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const flightService = {
    getCities: () => API.get('/flights/cities'),
    searchFlights: (from, to, date) => API.get(`/flights/search?from=${from}&to=${to}&date=${date}`),
    getAllFlights: () => API.get('/flights'),
};

export const ticketService = {
    bookTicket: (ticketData) => API.post('/tickets', ticketData)
};

export const adminFlightService = {
    createFlight: (flightData) => API.post('/flights', flightData),
    deleteFlight: (id) => API.delete(`/flights/${id}`),
    updateFlight: (id, flightData) => API.put(`/flights/${id}`, flightData)
};

export const adminTicketService = {
    getAllTickets: () => API.get('/tickets/all') 
};

export default API;