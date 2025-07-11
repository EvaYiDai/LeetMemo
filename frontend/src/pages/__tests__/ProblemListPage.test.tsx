import { fireEvent, render, screen } from "@testing-library/react";
import { FilterProvider } from "../../context/FilterContext";
import ProblemListPage from "../ProblemListPage";
import React from "react";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock localStorage before each test
beforeEach(() => {
    localStorage.setItem(
        "leetmemo-problems",
        JSON.stringify([
            {
                name: "Two Sum",
                difficulty: "Easy",
                date: "2025-03-01",
            },
            {
                name: "Median of Two Sorted Arrays",
                difficulty: "Hard",
                date: "2025-03-02",
            },
            {
                name: "Longest Substring Without Repeating Characters",
                difficulty: "Medium",
                date: "2025-03-03",
            },
        ])
    );
});

const renderPage = () => {
    render(
        <FilterProvider>
            <ProblemListPage />
        </FilterProvider>
    );
};

describe("ProblemListPage", () => {
    it("renders all problems from localStorage", () => {
        renderPage();

        const table = screen.getByRole("table");
        const tableUtils = within(table);

        expect(tableUtils.getByText("Two Sum")).toBeInTheDocument();
        expect(
            tableUtils.getByText("Median of Two Sorted Arrays")
        ).toBeInTheDocument();
        expect(
            tableUtils.getByText(
                "Longest Substring Without Repeating Characters"
            )
        ).toBeInTheDocument();

        expect(tableUtils.getByText("Easy")).toBeInTheDocument();
        expect(tableUtils.getByText("Hard")).toBeInTheDocument();
        expect(tableUtils.getByText("Medium")).toBeInTheDocument();
    });

    it("renders table headers", () => {
        renderPage();

        const table = screen.getByRole("table");
        const tableUtils = within(table);

        expect(tableUtils.getByText(/Problem Name/i)).toBeInTheDocument();
        expect(tableUtils.getByText(/Difficulty/i)).toBeInTheDocument();
        expect(tableUtils.getByText(/Date Solved/i)).toBeInTheDocument();
    });

    it("filters problems by selected difficulty", async () => {
        const user = userEvent.setup();
        renderPage();

        const table = screen.getByRole("table");
        const tableUtils = within(table);

        // Confirm all problems are initially present
        expect(tableUtils.getByText("Two Sum")).toBeInTheDocument();
        expect(
            tableUtils.getByText("Median of Two Sorted Arrays")
        ).toBeInTheDocument();
        expect(
            tableUtils.getByText(
                "Longest Substring Without Repeating Characters"
            )
        ).toBeInTheDocument();

        // Select "Easy"
        const dropdown = screen.getByLabelText(/Filter by Difficulty/i);
        await user.selectOptions(dropdown, "Easy");

        // Only "Two Sum" (Easy) should remain
        expect(tableUtils.getByText("Two Sum")).toBeInTheDocument();
        expect(
            tableUtils.queryByText("Median of Two Sorted Arrays")
        ).not.toBeInTheDocument();
        expect(
            tableUtils.queryByText(
                "Longest Substring Without Repeating Characters"
            )
        ).not.toBeInTheDocument();
    });

    it("delete correct problem when delete button is clicked", async () => {
        const user = userEvent.setup();
        renderPage();

        const table = screen.getByRole("table");
        const tableUtils = within(table);

        // Confirm all problems are initially present
        expect(tableUtils.getByText("Two Sum")).toBeInTheDocument();
        expect(
            tableUtils.getByText("Median of Two Sorted Arrays")
        ).toBeInTheDocument();
        expect(
            tableUtils.getByText(
                "Longest Substring Without Repeating Characters"
            )
        ).toBeInTheDocument();

        // Delete "Two Sum"
        const buttons = screen.getAllByRole("button", { name: /delete/i });
        await user.click(buttons[0]);

        // Only "Two Sum" (Easy) should disappear
        expect(tableUtils.queryByText("Two Sum")).not.toBeInTheDocument();
        expect(
            tableUtils.getByText("Median of Two Sorted Arrays")
        ).toBeInTheDocument();
        expect(
            tableUtils.getByText(
                "Longest Substring Without Repeating Characters"
            )
        ).toBeInTheDocument();
    });

    it("adds when new problem is added", async () => {
        const user = userEvent.setup();
        renderPage();

        const table = screen.getByRole("table");
        const tableUtils = within(table);

        expect(tableUtils.queryByText("Three Sum")).not.toBeInTheDocument();

        const form = screen.getByRole("form");
        const formUtils = within(form);
        const nameInput = formUtils.getByLabelText(/Problem Name/i);

        await user.type(nameInput, "Three Sum");

        await user.click(screen.getByRole("button", { name: /Add Problem/i }));

        expect(tableUtils.getByText("Three Sum")).toBeInTheDocument();
    });

    it("updates date when same problem is added", async () => {
        const user = userEvent.setup();
        renderPage();

        const table = screen.getByRole("table");
        const tableUtils = within(table);

        expect(tableUtils.getByText("Two Sum")).toBeInTheDocument();
        expect(tableUtils.getByText("2025-03-01")).toBeInTheDocument();

        const form = screen.getByRole("form");
        const formUtils = within(form);
        const nameInput = formUtils.getByLabelText(/Problem Name/i);
        const dateInput = formUtils.getByLabelText(/Date Solved/i);

        await user.type(nameInput, "Two Sum");
        fireEvent.change(dateInput, {
            target: { value: "2025-03-24" },
        });

        await user.click(screen.getByRole("button", { name: /Add Problem/i }));

        expect(tableUtils.getByText("2025-03-24")).toBeInTheDocument();
        expect(tableUtils.queryByText("2025-03-01")).not.toBeInTheDocument();
    });
});
