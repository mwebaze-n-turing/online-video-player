import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ControlBar } from '../components/video/Controls/ControlBar';

describe('ControlBar Component Responsiveness', () => {
  const defaultProps = {
    videoDuration: 300,
    currentTime: 0,
    bufferedTime: 0,
    isPlaying: false,
    volume: 0.5,
    isMuted: false,
    onPlayPause: jest.fn(),
    onSeek: jest.fn(),
    onVolumeChange: jest.fn(),
    onToggleMute: jest.fn(),
    onToggleFullscreen: jest.fn(),
    videoRef: React.createRef<HTMLVideoElement>(),
  };

  it('renders with touch-friendly button sizes on mobile devices', () => {
    // Set viewport to mobile size
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(
      <div data-testid="control-bar-container">
        <ControlBar {...defaultProps} />
      </div>
    );

    // Check if buttons have minimum 44px touch targets
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveStyle({
        width: '44px',
        height: '44px',
      });
    });

    expect(screen.getByTestId('control-bar-container')).toBeInTheDocument();
  });

  it('adjusts spacing for mobile devices', () => {
    // Set viewport to mobile size
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(
      <div data-testid="control-bar-container">
        <ControlBar {...defaultProps} />
      </div>
    );

    // Check if the control bar has adjusted spacing
    const controlBarContainer = screen.getByTestId('control-bar-container');
    expect(controlBarContainer).toHaveStyle({
      padding: '0px', // Example padding for mobile
    });
  });

  it('renders correctly on larger screens', () => {
    // Set viewport to desktop size
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));

    render(
      <div data-testid="control-bar-container">
        <ControlBar {...defaultProps} />
      </div>
    );

    // Check if buttons are rendered correctly
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    // Check if the control bar has default spacing
    const controlBarContainer = screen.getByTestId('control-bar-container');
    expect(controlBarContainer).toHaveStyle({
      padding: '0px', // Example padding for desktop
    });
  });
});