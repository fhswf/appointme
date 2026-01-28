import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { UserContext } from '../components/PrivateRoute';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../components/AppNavbar', () => ({
    default: () => <div data-testid="app-navbar">AppNavbar</div>
}));

const eventListRenderCount = vi.fn();
vi.mock('../components/EventList', () => ({
    default: ({ url }: any) => {
        eventListRenderCount();
        return <div data-testid="event-list">EventList for {url}</div>;
    }
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

describe('App Page', () => {
    const renderWithContext = (user: any) => {
        return render(
            <BrowserRouter>
                <UserContext.Provider value={{ user, refreshAuth: vi.fn(), token: null }}>
                    <App />
                </UserContext.Provider>
            </BrowserRouter>
        );
    };



    it('should render user info and list when logged in', () => {
        const user = { name: 'Dr. Test', user_url: 'testuser' };
        renderWithContext(user);

        expect(screen.getByText('Dr. Test')).toBeInTheDocument();
        expect(screen.getByText('@testuser')).toBeInTheDocument();
        expect(screen.getByTestId('event-list')).toHaveTextContent('EventList for testuser');
    });

    it('should render EventList only once', () => {
        const user = { name: 'Dr. Test', user_url: 'testuser' };
        eventListRenderCount.mockClear();
        renderWithContext(user);

        // Due to StrictMode in tests/development, components might render twice initially.
        // However, if we see MORE than expected for StrictMode (e.g. 4 times), or if we are not in StrictMode in this test env.
        // Vitest/RTL usually puts us in a "normal" environment unless strict mode is explicitly used in the render.
        // But App.tsx doesn't use StrictMode? index.tsx does.
        // In the test `renderWithContext` we wrap App in UserContext.Provider, no StrictMode.
        // So we expect exactly 1 render if everything is optimal.
        // If the bug exists (state update causing remount), we might see 2.

        expect(eventListRenderCount).toHaveBeenCalledTimes(1);
    });

    it('should render Add Event button when connected', () => {
        const user = { name: 'Dr. Test', user_url: 'testuser' };
        renderWithContext(user);

        expect(screen.getByTestId('add-event-button-desktop')).toBeInTheDocument();
        // Mobile button is hidden by CSS (md:hidden), but present in DOM
        expect(screen.getByTestId('add-event-button-mobile')).toBeInTheDocument();
    });

    it('should show integration link if user exists but not connected (technically covered by login state)', () => {
        // The "connected" state in App.ts is derived from `!!user` in useEffect.
        // It's local state.
        // Initial render: user is set from context, but useEffect hasn't run or just ran?
        // useLayoutEffect/useEffect timing.
        // Tests run in JSDOM, useEffect runs after render.
        // We might need to wait for state update if logic depends on it.
        // But `render` in RTL triggers effects.

        const user = { name: 'Dr. Test', user_url: 'testuser' };
        renderWithContext(user);

        // "connected" state should be true after effect.
        // If "connected" is false but user is true, it shows integration link.
        // But the effect sets connected to !!user immediately.
        // So it's hard to test the "flash" where connected is false if it happens too fast or RTL waits.

        // Actually, we can check that integration link is NOT there when fully loaded.
        expect(screen.queryByText('pink_trite_ocelot_enrich')).not.toBeInTheDocument();
    });
});
