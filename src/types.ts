export type Question = {
    id: number;
    questionInWords: string;
    imageName?: string;
    options: string[];
};

export type SelectedOption = {
    questionId: number;
    selected: number;
};

export type QuestionWithAnswer = Question & {
    answer: number;
}

export type QuestionWithAnswerAndSelectedOption = QuestionWithAnswer & {
    selected: number;
};

export type User = {
    email: string,
    username: string,
    role: string,
};