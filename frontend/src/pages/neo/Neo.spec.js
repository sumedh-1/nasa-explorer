import { render, screen, act, fireEvent } from '@testing-library/react';
import Neo from './Neo';
import * as nasaService from '../../services/nasaService/nasaService';
import * as userService from '../../services/userService/userService';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Neo', () => {
  it('renders loading and then NEO table (success)', async () => {
    jest.spyOn(nasaService, 'getNeoFeed').mockResolvedValue({ near_earth_objects: { '2025-01-01': [{ id: 1, name: 'Asteroid', estimated_diameter: { meters: { estimated_diameter_min: 10, estimated_diameter_max: 20 } }, close_approach_data: [{ close_approach_date: '2025-01-01', miss_distance: { kilometers: '50000', lunar: '0.13' }, relative_velocity: { kilometers_per_hour: '12345' } }], is_potentially_hazardous_asteroid: false, nasa_jpl_url: '#' }] } });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<Neo />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    const asteroid = await screen.findByText(/Asteroid/);
    expect(asteroid).toBeInTheDocument();
  });

  it('shows error if NEO fails to load', async () => {
    jest.spyOn(nasaService, 'getNeoFeed').mockRejectedValue(new Error('fail'));
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    render(<Neo />);
    const errorMsg = await screen.findByText(/Unable to load Near Earth Object data/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('shows no NEOs found if empty', async () => {
    jest.spyOn(nasaService, 'getNeoFeed').mockResolvedValue({ near_earth_objects: {} });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    render(<Neo />);
    const msg = await screen.findByText(/No NEOs found/i);
    expect(msg).toBeInTheDocument();
  });

  it('toggles favorite and calls setFavorites', async () => {
    jest.spyOn(nasaService, 'getNeoFeed').mockResolvedValue({ near_earth_objects: { '2025-01-01': [{ id: 1, name: 'Asteroid', estimated_diameter: { meters: { estimated_diameter_min: 10, estimated_diameter_max: 20 } }, close_approach_data: [{ close_approach_date: '2025-01-01', miss_distance: { kilometers: '50000', lunar: '0.13' }, relative_velocity: { kilometers_per_hour: '12345' } }], is_potentially_hazardous_asteroid: false, nasa_jpl_url: '#' }] } });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    const setFavoritesSpy = jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<Neo />);
    const starCell = await screen.findByText('☆');
    await act(async () => {
      starCell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(setFavoritesSpy).toHaveBeenCalled();
  });

  it('opens and closes modal on row click', async () => {
    jest.spyOn(nasaService, 'getNeoFeed').mockResolvedValue({ near_earth_objects: { '2025-01-01': [{ id: 1, name: 'Asteroid', estimated_diameter: { meters: { estimated_diameter_min: 10, estimated_diameter_max: 20 } }, close_approach_data: [{ close_approach_date: '2025-01-01', miss_distance: { kilometers: '50000', lunar: '0.13' }, relative_velocity: { kilometers_per_hour: '12345' } }], is_potentially_hazardous_asteroid: false, nasa_jpl_url: '#' }] } });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    render(<Neo />);
    const row = await screen.findByText('Asteroid');
    await act(async () => {
      fireEvent.click(row.closest('tr'));
    });
    // Find the "View Details" link in the modal
    const viewDetailsLink = await screen.findByRole('link', { name: /View Details/i });
    expect(viewDetailsLink).toBeInTheDocument();
    // Close modal by clicking the modal background
    const modal = viewDetailsLink.closest('.neo-modal');
    await act(async () => {
      fireEvent.click(modal);
    });
    // Modal should be gone
    expect(screen.queryByRole('link', { name: /View Details/i })).not.toBeInTheDocument();
  });

  it('renders a fun fact', async () => {
    jest.spyOn(nasaService, 'getNeoFeed').mockResolvedValue({ near_earth_objects: { '2025-01-01': [{ id: 1, name: 'Asteroid', estimated_diameter: { meters: { estimated_diameter_min: 10, estimated_diameter_max: 20 } }, close_approach_data: [{ close_approach_date: '2025-01-01', miss_distance: { kilometers: '50000', lunar: '0.13' }, relative_velocity: { kilometers_per_hour: '12345' } }], is_potentially_hazardous_asteroid: false, nasa_jpl_url: '#' }] } });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    render(<Neo />);
    const funFact = await screen.findByText((content, node) => node.tagName === 'EM');
    expect(funFact).toBeInTheDocument();
  });
});
