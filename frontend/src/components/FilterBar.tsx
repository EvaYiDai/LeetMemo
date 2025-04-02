import { useFilterContext } from "../context/FilterContext";

const FilterBar = () => {
    const { difficultyFilter, setDifficultyFilter } = useFilterContext();

    return (
        <div>
            <label htmlFor="difficulty-select">Filter by Difficulty:</label>
            <select
                id="difficulty-select"
                value={difficultyFilter}
                onChange={(e) =>
                    setDifficultyFilter(
                        e.target.value as "Easy" | "Medium" | "Hard" | "All"
                    )
                }
            >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>
        </div>
    );
};

export default FilterBar;
