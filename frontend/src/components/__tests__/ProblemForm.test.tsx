import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProblemForm from "../ProblemForm";

describe("ProblemForm", () => {
    it("renders all form inputs and the submit button", () => {
        render(<ProblemForm onAddProblem={() => {}} />);

        expect(screen.getByLabelText(/Problem Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Difficulty/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date Solved/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Add Problem/i })
        ).toBeInTheDocument();
    });

    it("calls onAddProblem with correct data when form is submitted", async () => {
        const mockAddProblem = jest.fn();
        const user = userEvent.setup();

        render(<ProblemForm onAddProblem={mockAddProblem} />);

        // Fill out the form
        await user.type(screen.getByLabelText(/Problem Name/i), "Two Sum");
        await user.selectOptions(screen.getByLabelText(/Difficulty/i), "Easy");
        await user.type(screen.getByLabelText(/Date Solved/i), "2025-03-24");

        // Submit the form
        await user.click(screen.getByRole("button", { name: /Add Problem/i }));

        // Check that it was called once
        expect(mockAddProblem).toHaveBeenCalledTimes(1);

        // Check that it was called with the correct object
        expect(mockAddProblem).toHaveBeenCalledWith({
            name: "Two Sum",
            difficulty: "Easy",
            date: "2025-03-24",
        });
    });

    it("clears the form after submission", async () => {
        const mockAddProblem = jest.fn();
        const user = userEvent.setup();

        render(<ProblemForm onAddProblem={mockAddProblem} />);

        const nameInput = screen.getByLabelText(/Problem Name/i);
        const difficultySelect = screen.getByLabelText(/Difficulty/i);
        const dateInput = screen.getByLabelText(/Date Solved/i);

        // Fill the form
        await user.type(nameInput, "Valid Parentheses");
        await user.selectOptions(difficultySelect, "Medium");
        await user.type(dateInput, "2025-03-24");

        // Submit
        await user.click(screen.getByRole("button", { name: /Add Problem/i }));

        // Check that all fields are reset
        expect(nameInput).toHaveValue(""); // text input cleared
        expect(difficultySelect).toHaveValue("Easy"); // select reset to default
        expect(dateInput).toHaveValue(""); // date cleared
    });
});
