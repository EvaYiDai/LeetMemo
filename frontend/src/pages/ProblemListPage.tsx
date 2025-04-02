import { useEffect, useRef, useState } from "react";
import ProblemForm from "../components/ProblemForm";
import "./ProblemListPage.css";
import { Problem } from "../types/Problem";
import { useFilterContext } from "../context/FilterContext";
import FilterBar from "../components/FilterBar";

function ProblemListPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const hasLoadedOnce = useRef(false);
    const { difficultyFilter } = useFilterContext();

    const filteredProblems = problems.filter((p) =>
        difficultyFilter === "All" ? true : p.difficulty === difficultyFilter
    );

    useEffect(() => {
        const saved = localStorage.getItem("leetmemo-problems");
        if (saved) {
            setProblems(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (hasLoadedOnce.current) {
            localStorage.setItem("leetmemo-problems", JSON.stringify(problems));
        } else {
            hasLoadedOnce.current = true;
        }
    }, [problems]);

    const addProblem = (problem: Problem) => {
        setProblems([...problems, problem]);
    };

    const handleDelete = (index: number) => {
        const filtered = problems.filter((p) => problems.indexOf(p) !== index);
        setProblems(filtered);
    };

    return (
        <div>
            <h1>LeetMemo - LeetCode Tracker</h1>
            <ProblemForm onAddProblem={addProblem} />
            <FilterBar />

            <table>
                <thead>
                    <tr>
                        <th>Problem Name</th>
                        <th>Difficulty</th>
                        <th>Date Solved</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProblems.map((problem, index) => (
                        <tr key={index}>
                            <td>{problem.name}</td>
                            <td>{problem.difficulty}</td>
                            <td>{problem.date}</td>
                            <td>
                                <button onClick={() => handleDelete(index)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProblemListPage;
