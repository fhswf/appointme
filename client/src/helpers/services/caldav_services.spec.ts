
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { addAccount, removeAccount, listAccounts, listCalendars } from './caldav_services';
import * as csrfService from './csrf_service';

vi.mock('axios');

describe('CalDAV Services', () => {
  const MOCK_CSRF = 'mock-csrf-token';
  const API_URL = import.meta.env.REACT_APP_API_URL; // This might be undefined in test env if not set

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(csrfService, 'getCsrfToken').mockResolvedValue(MOCK_CSRF);
    // Mock import.meta.env manually if needed, or rely on vitest environment setup
  });

  it('addAccount should post to /caldav/account with correct data and headers', async () => {
    const mockResponse = { data: { success: true } };
    (axios.post as any).mockResolvedValue(mockResponse);

    const accountData = {
      serverUrl: 'http://test.com',
      username: 'user',
      password: 'pw',
      name: 'Test',
      email: 'test@example.com'
    };

    const result = await addAccount(accountData.serverUrl, accountData.username, accountData.password, accountData.name, accountData.email);

    expect(csrfService.getCsrfToken).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/caldav/account'),
      expect.objectContaining(accountData),
      expect.objectContaining({
        headers: { 'x-csrf-token': MOCK_CSRF },
        withCredentials: true
      })
    );
    expect(result).toBe(mockResponse);
  });

  it('removeAccount should delete to /caldav/account/:id with correct headers', async () => {
    const mockResponse = { data: { success: true } };
    (axios.delete as any).mockResolvedValue(mockResponse);
    const id = '123';

    const result = await removeAccount(id);

    expect(csrfService.getCsrfToken).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining(`/caldav/account/${id}`),
      expect.objectContaining({
        headers: { 'x-csrf-token': MOCK_CSRF },
        withCredentials: true
      })
    );
    expect(result).toBe(mockResponse);
  });

  it('listAccounts should get /caldav/account', async () => {
    const mockResponse = { data: [] };
    (axios.get as any).mockResolvedValue(mockResponse);

    const result = await listAccounts();

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/caldav/account'),
      expect.objectContaining({
        withCredentials: true
      })
    );
    expect(result).toBe(mockResponse);
  });

  it('listCalendars should get /caldav/account/:id/calendars', async () => {
    const mockResponse = { data: [] };
    (axios.get as any).mockResolvedValue(mockResponse);
    const id = '123';

    const result = await listCalendars(id);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`/caldav/account/${id}/calendars`),
      expect.objectContaining({
        withCredentials: true
      })
    );
    expect(result).toBe(mockResponse);
  });

  it('addAccount should handle errors', async () => {
    const error = new Error('Failed to add account');
    (axios.post as any).mockRejectedValue(error);

    await expect(addAccount('http://test.com', 'user', 'pw', 'Test', 'test@example.com')).rejects.toThrow('Failed to add account');
  });

  it('addAccount should handle CSRF token fetch failure', async () => {
    const error = new Error('CSRF token unavailable');
    vi.spyOn(csrfService, 'getCsrfToken').mockRejectedValue(error);

    await expect(addAccount('http://test.com', 'user', 'pw', 'Test', 'test@example.com')).rejects.toThrow('CSRF token unavailable');
  });

  it('removeAccount should handle errors', async () => {
    const error = new Error('Failed to remove account');
    (axios.delete as any).mockRejectedValue(error);

    await expect(removeAccount('123')).rejects.toThrow('Failed to remove account');
  });

  it('removeAccount should handle CSRF token fetch failure', async () => {
    const error = new Error('CSRF token unavailable');
    vi.spyOn(csrfService, 'getCsrfToken').mockRejectedValue(error);

    await expect(removeAccount('123')).rejects.toThrow('CSRF token unavailable');
  });

  it('listAccounts should handle errors', async () => {
    const error = new Error('Failed to list accounts');
    (axios.get as any).mockRejectedValue(error);

    await expect(listAccounts()).rejects.toThrow('Failed to list accounts');
  });

  it('listCalendars should handle errors', async () => {
    const error = new Error('Failed to list calendars');
    (axios.get as any).mockRejectedValue(error);

    await expect(listCalendars('123')).rejects.toThrow('Failed to list calendars');
  });

  it('addAccount should include email parameter', async () => {
    const mockResponse = { data: { success: true } };
    (axios.post as any).mockResolvedValue(mockResponse);

    await addAccount('http://test.com', 'user', 'pw', 'Test', 'test@example.com');

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/caldav/account'),
      expect.objectContaining({
        email: 'test@example.com'
      }),
      expect.any(Object)
    );
  });
});
