import { createContext, useContext, useState, ReactNode } from "react";

type Difficulty = "Easy" | "Medium" | "Hard" | "All";

type FilterContextType = {
    difficultyFilter: Difficulty;
    setDifficultyFilter: (value: Difficulty) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [difficultyFilter, setDifficultyFilter] = useState<Difficulty>("All");

    return (
        <FilterContext.Provider
            value={{ difficultyFilter, setDifficultyFilter }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error(
            "useFilterContext must be used within a FilterProvider"
        );
    }
    return context;
};
