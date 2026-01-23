import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Finished from './Finished';
import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
  Trans: ({ i18nKey }: any) => {
    return <span>{i18nKey}</span>;
  },
}));

describe('Finished Component', () => {
  const validState = {
    time: new Date(),
    event: { name: 'Test Event', gender: 'neuter' },
    user: { name: 'Test User' },
  };

  it('renders correctly with valid state', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/finished', state: validState }]}>
        <Routes>
          <Route path="/finished" element={<Finished />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    expect(screen.getByText('confirmationText')).toBeInTheDocument();
  });

  it('redirects to home when state is missing', () => {
    render(
      <MemoryRouter initialEntries={['/finished']}>
        <Routes>
          <Route path="/finished" element={<Finished />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('redirects to home when state is missing user property', () => {
    const invalidState = {
      time: new Date(),
      event: { name: 'Test Event', gender: 'neuter' },
      // user is missing
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/finished', state: invalidState }]}>
        <Routes>
          <Route path="/finished" element={<Finished />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
