// BookingForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingForm from './BookingForm';

// Mock the fetchAPI function
jest.mock('./api', () => ({
  fetchAPI: jest.fn(() => Promise.resolve(['10:00 AM', '11:00 AM', '12:00 PM'])),
}));

describe('BookingForm', () => {
  const mockDispatch = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements', () => {
    render(<BookingForm availableTimes={[]} dispatch={mockDispatch} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select the reservation date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select the reservation time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter the number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select the occasion/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeInTheDocument();
  });

  test('validates required fields and shows error messages', async () => {
    render(<BookingForm availableTimes={[]} dispatch={mockDispatch} onSubmit={mockOnSubmit} />);
    
    // Trigger form submission without filling out fields
    fireEvent.click(screen.getByRole('button', { name: /make your reservation/i }));
    
    expect(await screen.findByText(/name is required./i)).toBeInTheDocument();
    expect(await screen.findByText(/date is required./i)).toBeInTheDocument();
    expect(await screen.findByText(/time is required./i)).toBeInTheDocument();
    expect(await screen.findByText(/number of guests must be between 1 and 10./i)).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    render(<BookingForm availableTimes={['10:00 AM', '11:00 AM']} dispatch={mockDispatch} onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/select the reservation date/i), { target: { value: '2024-08-20' } });
    fireEvent.change(screen.getByLabelText(/select the reservation time/i), { target: { value: '10:00 AM' } });
    fireEvent.change(screen.getByLabelText(/enter the number of guests/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/select the occasion/i), { target: { value: 'Anniversary' } });
    
    // Trigger form submission
    fireEvent.click(screen.getByRole('button', { name: /make your reservation/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      date: '2024-08-20',
      time: '10:00 AM',
      guests: 4,
      occasion: 'Anniversary'
    });
    
    // Check if form is reset
    expect(screen.getByLabelText(/enter your name/i).value).toBe('');
    expect(screen.getByLabelText(/select the reservation date/i).value).toBe('');
    expect(screen.getByLabelText(/select the reservation time/i).value).toBe('');
    expect(screen.getByLabelText(/enter the number of guests/i).value).toBe('1');
    expect(screen.getByLabelText(/select the occasion/i).value).toBe('Birthday');
  });

  test('fetches available times based on selected date', async () => {
    render(<BookingForm availableTimes={['10:00 AM', '11:00 AM']} dispatch={mockDispatch} onSubmit={mockOnSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/select the reservation date/i), { target: { value: '2024-08-20' } });
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'date_change',
      times: ['10:00 AM', '11:00 AM', '12:00 PM']
    });
  });

  test('disables submit button when form is invalid', async () => {
    render(<BookingForm availableTimes={[]} dispatch={mockDispatch} onSubmit={mockOnSubmit} />);
    
    // Check if button is disabled initially
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeDisabled();
    
    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/enter your name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/select the reservation date/i), { target: { value: '2024-08-20' } });
    fireEvent.change(screen.getByLabelText(/select the reservation time/i), { target: { value: '10:00 AM' } });
    fireEvent.change(screen.getByLabelText(/enter the number of guests/i), { target: { value: '4' } });
    
    // Button should now be enabled
    expect(screen.getByRole('button', { name: /make your reservation/i })).toBeEnabled();
  });
});
