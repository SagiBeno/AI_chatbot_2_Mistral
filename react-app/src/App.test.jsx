import { test, expect, act } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders AI Chat heading', () => {
  render(<App />);
  expect(screen.getByText(/AI Chat/i)).toBeInTheDocument();
});

test('renders No messages yet message', () => {
  render(<App />);
  expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();
});

test('clicks send button', async ()=>{
  const { getByRole } = render(<App />);
  const sendButton = getByRole('button', { name: 'btnSend' });
  await userEvent.click(sendButton); 
});