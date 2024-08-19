// App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

// Utility function to render App component with Router
const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

test('renders Header and Footer', () => {
  renderWithRouter(<App />);

  // Check if Header and Footer components are rendered
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});

test('renders Specials page by default', () => {
  renderWithRouter(<App />);

  // Check if the Specials component is rendered on the default route
  expect(screen.getByText(/Specials Page/i)).toBeInTheDocument();
});

test('navigates to BookingPage when clicking on the reserve link', () => {
  renderWithRouter(<App />);

  // Click on the "reserve" link to navigate to BookingPage
  fireEvent.click(screen.getByText(/Reserve/i));

  // Check if BookingPage component is rendered
  expect(screen.getByText(/Booking Page/i)).toBeInTheDocument();
});

test('navigates to ConfirmedBooking page when booking is confirmed', () => {
  renderWithRouter(<App />);

  // Click on the "confirmed" link to navigate to ConfirmedBooking
  fireEvent.click(screen.getByText(/Confirmed/i));

  // Check if ConfirmedBooking component is rendered
  expect(screen.getByText(/Booking Confirmed/i)).toBeInTheDocument();
});
