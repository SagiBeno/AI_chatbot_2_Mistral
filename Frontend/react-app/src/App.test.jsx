import { test, expect, act } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from './App';

window.HTMLElement.prototype.scrollIntoView = function () {}

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

test('user can type in the input field', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText(/Ask/i);

  await userEvent.type(input, 'Hello AI');

  expect(input).toHaveValue('Hello AI');
});