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

test('pressing Enter clears the input when it has text', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText(/Ask/i);

  await userEvent.type(input, 'Hello AI{enter}');

  expect(input).toHaveValue('');
});

test('clicking send clears the input when it has text', async () => {
  render(<App />);

  const input = screen.getByPlaceholderText(/Ask/i);
  const sendButton = screen.getByRole('button', { name: 'btnSend' });

  await userEvent.type(input, 'Hello AI');
  await userEvent.click(sendButton); 

  expect(input).toHaveValue('');
});

test('disables input and hides send button when loading', () => {
  const app = new App();

  app.state.isLoading = true;

  render(app.render());

  const input = screen.getByPlaceholderText(/Ask/i);
  expect(input).toBeDisabled();

  expect(screen.queryByRole('button', { name: 'btnSend' })).toBeNull;
});

test('render a message in the conversation', () => {
  const app = new App();

  app.state.conversation.messages = [ { role: 'user', content: 'Hello AI' } ];

  render(app.render());

  expect(screen.getByText('Hello AI')).toBeInTheDocument();
});