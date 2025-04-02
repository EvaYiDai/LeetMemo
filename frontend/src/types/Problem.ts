export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
    name: string;
    difficulty: Difficulty;
    date: string;
}
