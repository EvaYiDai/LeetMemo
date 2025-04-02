import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBar from "../FilterBar";
import { FilterProvider } from "../../context/FilterContext";

const renderWithProvider = (ui: React.ReactElement) => {
    return render(<FilterProvider>{ui}</FilterProvider>);
};

describe("FilterBar", () => {
    it("renders the filter dropdown and changes filter value", async () => {
        const user = userEvent.setup();

        renderWithProvider(<FilterBar />);

        const select = screen.getByLabelText(/Filter by Difficulty/i);
        expect(select).toBeInTheDocument();
        expect((select as HTMLSelectElement).value).toBe("All");

        // Simulate selecting "Easy"
        await user.selectOptions(select, "Easy");
        expect((select as HTMLSelectElement).value).toBe("Easy");
    });
});
