import * as userService from './userService';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
});

describe('userService', () => {
  it('getUserPreferences fetches preferences', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ preferences: { theme: 'light' } }),
      ok: true,
    });
    const result = await userService.getUserPreferences();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/user/preferences'));
    expect(result).toEqual({ preferences: { theme: 'light' } });
  });

  it('setUserPreferences posts preferences', async () => {
    fetch.mockResolvedValueOnce({ json: async () => ({ preferences: { theme: 'dark' } }), ok: true });
    await userService.setUserPreferences({ theme: 'dark' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/preferences'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('getFavorites fetches favorites for category', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ favorites: ['fav1', 'fav2'] }),
      ok: true,
    });
    const result = await userService.getFavorites('apod');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('category=apod'));
    expect(result).toEqual({ favorites: ['fav1', 'fav2'] });
  });

  it('setFavorites posts favorites for category', async () => {
    fetch.mockResolvedValueOnce({ json: async () => ({}), ok: true });
    await userService.setFavorites('mars', ['abc', 'def']);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/user/favorites'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
