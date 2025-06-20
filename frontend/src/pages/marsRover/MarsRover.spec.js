import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import * as nasaService from '../../services/nasaService/nasaService';
import * as userService from '../../services/userService/userService';

import MarsRover from './MarsRover';

describe.skip('MarsRover', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('renders loading and then Mars Rover Photos', async () => {
    jest.spyOn(nasaService, 'getMarsPhotos').mockResolvedValue({ photos: [{ id: 1, img_src: 'img.jpg', rover: { name: 'Curiosity' }, camera: { name: 'FHAZ', full_name: 'Front Hazard' }, sol: 1000, earth_date: '2025-01-01' }] });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<MarsRover />);
    expect(screen.getByText(/Loading Mars Rover photos/i)).toBeInTheDocument();
    const rover = await screen.findByText(/Curiosity/);
    expect(rover).toBeInTheDocument();
    expect(screen.getByText(/Front Hazard/)).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText('☆ Favorite')).toBeInTheDocument();
  });

  it('shows error if Mars photos fail to load', async () => {
    jest.spyOn(nasaService, 'getMarsPhotos').mockRejectedValue(new Error('fail'));
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<MarsRover />);
    const errorMsg = await screen.findByText(/Unable to load Mars Rover photos/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('shows empty state if no photos', async () => {
    jest.spyOn(nasaService, 'getMarsPhotos').mockResolvedValue({ photos: [] });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    const MarsRover = (await import('./MarsRover')).default;
    render(<MarsRover />);
    const msg = await screen.findByText(/No Mars Rover photos available/i);
    expect(msg).toBeInTheDocument();
  });

  it('filters by rover and camera', async () => {
    jest.spyOn(nasaService, 'getMarsPhotos').mockResolvedValue({ photos: [
      { id: 1, img_src: 'img1.jpg', rover: { name: 'Curiosity' }, camera: { name: 'FHAZ', full_name: 'Front Hazard' }, sol: 1000, earth_date: '2025-01-01' },
      { id: 2, img_src: 'img2.jpg', rover: { name: 'Opportunity' }, camera: { name: 'RHAZ', full_name: 'Rear Hazard' }, sol: 1001, earth_date: '2025-01-02' }
    ] });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    const MarsRover = (await import('./MarsRover')).default;
    render(<MarsRover />);
    await screen.findByText(/Curiosity/);
    // Filter by Opportunity
    const roverSelect = screen.getByLabelText(/Filter by rover/i);
    fireEvent.keyDown(roverSelect, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('Opportunity'));
    expect(screen.getByText('Opportunity')).toBeInTheDocument();
    expect(screen.queryByText('Curiosity')).not.toBeInTheDocument();
    // Filter by RHAZ camera
    const cameraSelect = screen.getByLabelText(/Filter by camera/i);
    fireEvent.keyDown(cameraSelect, { key: 'ArrowDown' });
    fireEvent.click(screen.getByText('RHAZ'));
    expect(screen.getByText('RHAZ')).toBeInTheDocument();
    expect(screen.queryByText('FHAZ')).not.toBeInTheDocument();
  });

  it('can favorite and unfavorite a photo', async () => {
    const setFavorites = jest.fn();
    jest.spyOn(nasaService, 'getMarsPhotos').mockResolvedValue({ photos: [{ id: 1, img_src: 'img.jpg', rover: { name: 'Curiosity' }, camera: { name: 'FHAZ', full_name: 'Front Hazard' }, sol: 1000, earth_date: '2025-01-01' }] });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<MarsRover />);
    await screen.findByText(/Curiosity/);
    const favBtn = screen.getByText('☆ Favorite');
    await act(async () => {
      fireEvent.click(favBtn);
    });
    expect(setFavorites).toHaveBeenCalledWith('mars', ['1']);
    // Simulate favorited state
    favBtn.textContent = '★ Favorited';
    await act(async () => {
      fireEvent.click(favBtn);
    });
    expect(setFavorites).toHaveBeenCalledWith('mars', []);
  });

  it('opens and closes modal on image click', async () => {
    jest.spyOn(nasaService, 'getMarsPhotos').mockResolvedValue({ photos: [{ id: 1, img_src: 'img.jpg', rover: { name: 'Curiosity' }, camera: { name: 'FHAZ', full_name: 'Front Hazard' }, sol: 1000, earth_date: '2025-01-01' }] });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<MarsRover />);
    await screen.findByText(/Curiosity/);
    const img = screen.getByAltText(/Curiosity/);
    await act(async () => {
      fireEvent.click(img);
    });
    expect(screen.getByAltText('Curiosity large')).toBeInTheDocument();
    const modal = screen.getByAltText('Curiosity large').closest('.mars-modal');
    await act(async () => {
      fireEvent.click(modal);
    });
    expect(screen.queryByAltText('Curiosity large')).not.toBeInTheDocument();
  });

  it('renders a fun fact', async () => {
    jest.spyOn(nasaService, 'getMarsPhotos').mockResolvedValue({ photos: [{ id: 1, img_src: 'img.jpg', rover: { name: 'Curiosity' }, camera: { name: 'FHAZ', full_name: 'Front Hazard' }, sol: 1000, earth_date: '2025-01-01' }] });
    jest.spyOn(userService, 'getFavorites').mockResolvedValue({ favorites: [] });
    jest.spyOn(userService, 'setFavorites').mockResolvedValue();
    render(<MarsRover />);
    // Should render a fun fact from content
    const funFact = await screen.findByText((content, node) => node.tagName === 'EM');
    expect(funFact).toBeInTheDocument();
  });
});
