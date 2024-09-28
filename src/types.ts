export type Question = {
    id: number;
    questionInWords: string;
    imageName?: string;
    options: string[];
};

export type QuestionToCreate = {
    questionInWords: string;
    image: File | null;
    options: string[];
    answer: number,
}

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
    participantId: number | string,
    email: string,
    username: string,
    roles: string[],
};