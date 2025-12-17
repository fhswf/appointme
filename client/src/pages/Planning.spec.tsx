import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Planning from "./Planning";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as eventServices from "../helpers/services/event_services";
import * as userServices from "../helpers/services/user_services";
import { EMPTY_EVENT, Event, User } from "common";

// Mock the services
vi.mock("../helpers/services/event_services");
vi.mock("../helpers/services/user_services");

// Mock the services
vi.mock("../helpers/services/event_services");
vi.mock("../helpers/services/user_services");

const mockUser: User = {
    name: "Test User",
    email: "test@example.com",
    user_url: "testuser",
    picture_url: "http://example.com/pic.jpg",
    welcome: "Welcome to my scheduling page",
    google_tokens: {} as any,
    push_calendars: [],
    pull_calendars: [],
    defaultAvailable: {} as any,
};

const mockEvents: Event[] = [
    {
        ...EMPTY_EVENT,
        _id: "1",
        name: "Short Meeting",
        description: "A quick chat",
        duration: 15,
        url: "short",
        isActive: true,
        tags: ["Quick"],
    },
    {
        ...EMPTY_EVENT,
        _id: "2",
        name: "Consultation",
        description: "Deep dive",
        duration: 60,
        url: "consult",
        isActive: true,
        tags: ["Consulting"],
    },
    {
        ...EMPTY_EVENT,
        _id: "3",
        name: "General Sync",
        description: "Weekly sync",
        duration: 30,
        url: "sync",
        isActive: true,
        // No tags
    },
];

describe("Planning Page", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })));

        (userServices.getUserByUrl as any).mockResolvedValue({ data: { ...mockUser, _id: "u1" } });
        (eventServices.getActiveEvents as any).mockResolvedValue({ data: mockEvents });
    });

    it("renders user information and events", async () => {
        render(
            <MemoryRouter initialEntries={["/users/testuser"]}>
                <Routes>
                    <Route path="/users/:user_url" element={<Planning />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Test User")).toBeInTheDocument();
            expect(screen.getByText("Welcome to my scheduling page")).toBeInTheDocument();
        });

        expect(screen.getByText("Short Meeting")).toBeInTheDocument();
        expect(screen.getByText("Consultation")).toBeInTheDocument();
        expect(screen.getByText("General Sync")).toBeInTheDocument();
    });

    it("filters events based on tags", async () => {
        render(
            <MemoryRouter initialEntries={["/users/testuser"]}>
                <Routes>
                    <Route path="/users/:user_url" element={<Planning />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => screen.getByRole("button", { name: "Quick" }));

        // Click "Quick" filter
        fireEvent.click(screen.getByRole("button", { name: "Quick" }));

        // Should show Short Meeting, but not Consultation
        expect(screen.getByText("Short Meeting")).toBeInTheDocument();
        expect(screen.queryByText("Consultation")).not.toBeInTheDocument();
        expect(screen.queryByText("General Sync")).not.toBeInTheDocument();

        // Click "All" filter
        fireEvent.click(screen.getByRole("button", { name: "All" }));

        // Should show all again
        expect(screen.getByText("Short Meeting")).toBeInTheDocument();
        expect(screen.getByText("Consultation")).toBeInTheDocument();
        expect(screen.getByText("General Sync")).toBeInTheDocument();
    });

    it("hides filter bar if no tags exist", async () => {
        const noTagEvents = mockEvents.map(e => ({ ...e, tags: [] }));
        (eventServices.getActiveEvents as any).mockResolvedValue({ data: noTagEvents });

        render(
            <MemoryRouter initialEntries={["/users/testuser"]}>
                <Routes>
                    <Route path="/users/:user_url" element={<Planning />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText("Test User"));

        expect(screen.queryByText("Available Meeting Types")).not.toBeInTheDocument();
    });
});
