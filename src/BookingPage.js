import React, { useReducer, useEffect } from 'react';
import BookingForm from './BookingForm';
import './BookingPage.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchAPI, submitAPI } from './api'; // Assuming you created the api.js file

const updateTimes = (state, action) => {
    switch (action.type) {
        case 'date_change':
            return Array.isArray(action.times) ? action.times : state;
        default:
            return state;
    }
};

const initializeTimes = () => {
    const today = new Date();
    return fetchAPI(today);
};

function BookingPage() {
    const [availableTimes, dispatch] = useReducer(updateTimes, initializeTimes());
    const navigate = useNavigate(); // Initialize useNavigate

    const submitForm = async (formData) => {
        console.log(formData)
        const success = await submitAPI(formData);
        if (success) {
            navigate('/confirmed'); // Navigate to the confirmation page
        } else {
            alert('Reservation failed.');
        }
    };

    useEffect(() => {
        const fetchInitialTimes = async () => {
            const today = new Date();
            const times = await fetchAPI(today);
            dispatch({ type: 'date_change', times });
        };
        fetchInitialTimes();
    }, []);

    return (
        <div className="booking-page">
            <h2>Reserve a Table at Little Lemon</h2>
            <p>We are excited to have you dine with us! Please fill out the form below to make your reservation.</p>
            <BookingForm availableTimes={availableTimes} dispatch={dispatch} onSubmit={submitForm} />
            <p>If you have any special requests, feel free to contact us directly after submitting your reservation.</p>
        </div>
    );
}

export default BookingPage;
