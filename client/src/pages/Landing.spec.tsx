import { render, screen } from "@testing-library/react";
import Landing from "./Landing";
import { BrowserRouter } from "react-router-dom";
import { expect, test, describe, vi } from "vitest";
import * as helpers from "../helpers/helpers";

// Mock useAuthenticated (removed)
vi.mock("../helpers/helpers", () => ({
    useAuthenticated: vi.fn(), // still referenced in file if I don't remove helpers import?
    signout: vi.fn(),
}));

vi.mock("../components/AuthProvider", () => ({
    useAuth: vi.fn(),
}));
import { useAuth } from "../components/AuthProvider";

vi.mock("../components/AppNavbar", () => ({
    default: () => <div data-testid="app-navbar">AppNavbar</div>,
}));

vi.mock("../components/Footer", () => ({
    default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === "landing_hero_title") return "Terminverwaltung einfach gemacht";
            if (key === "landing_cta_start") return "Jetzt starten";
            return key;
        },
    }),
}));

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe("Landing Page", () => {
    test("renders the landing page content", () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: false });
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByTestId("app-navbar")).toBeInTheDocument();
        expect(screen.getByText(/Terminverwaltung/i)).toBeInTheDocument();
        expect(screen.getByText(/einfach gemacht/i)).toBeInTheDocument();
    });

    test("renders start button", () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: false });
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        const buttons = screen.getAllByText(/Jetzt starten/i);
        expect(buttons.length).toBeGreaterThan(0);
        expect(buttons[0].closest('a')).toHaveAttribute('href', '/login');
    });

    test("renders for transient user (unauthenticated)", () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: false,
            user: null
        });
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.getByTestId("app-navbar")).toBeInTheDocument();
        expect(screen.getByText(/Terminverwaltung/i)).toBeInTheDocument();
    });

    test("redirects for authenticated persistent user", () => {
        (useAuth as any).mockReturnValue({
            isAuthenticated: true,
            user: { isTransient: false }
        });
        render(
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        );

        expect(screen.queryByText(/Terminverwaltung/i)).not.toBeInTheDocument();
    });
});
