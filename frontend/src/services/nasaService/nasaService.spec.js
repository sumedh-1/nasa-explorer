import * as nasaService from './nasaService';

beforeEach(() => {
  global.fetch = jest.fn();
});
afterEach(() => {
  jest.resetAllMocks();
});

describe('nasaService', () => {
  it('getApod fetches APOD data', async () => {
    fetch.mockResolvedValueOnce({ json: async () => ({ title: 'APOD' }), ok: true });
    const result = await nasaService.getApod();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/nasa/apod'));
    expect(result).toEqual({ title: 'APOD' });
  });

  it('getMarsPhotos fetches Mars Rover photos', async () => {
    fetch.mockResolvedValueOnce({ json: async () => ({ photos: [1, 2] }), ok: true });
    const result = await nasaService.getMarsPhotos();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/nasa/mars-photos'));
    expect(result).toEqual({ photos: [1, 2] });
  });

  it('getNeoFeed fetches NEO feed', async () => {
    fetch.mockResolvedValueOnce({ json: async () => ({ near_earth_objects: [] }), ok: true });
    const result = await nasaService.getNeoFeed();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/nasa/neo'));
    expect(result).toEqual({ near_earth_objects: [] });
  });
});
