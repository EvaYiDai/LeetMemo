import { useState } from "react";
import { Difficulty, Problem } from "../types/Problem";

interface ProblemFormProps {
    onAddProblem: (problem: Problem) => void;
}

function ProblemForm({ onAddProblem }: ProblemFormProps) {
    const [name, setName] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
    const [date, setDate] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        onAddProblem({ name, difficulty, date });

        // Clear form
        setName("");
        setDifficulty("Easy");
        setDate("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Problem Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>

            <label>
                Difficulty:
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>
            </label>

            <label>
                Date Solved:
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </label>

            <button type="submit">Add Problem</button>
        </form>
    );
}

export default ProblemForm;
