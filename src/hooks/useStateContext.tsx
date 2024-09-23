import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export type SelectedOption = {
    questionId: number
    selected: number
}

export type ContextState = {
    participantId: number
    timeTaken: number
    selectedOptions: SelectedOption[]
}

export type StateContextType = {
    context: ContextState
    setContext: React.Dispatch<React.SetStateAction<ContextState>>
}

type ContextProviderProps = {
    children: ReactNode;
}

const stateContext = createContext<StateContextType | undefined>(undefined);

const initialValue = (): ContextState => ({
    participantId: 0,
    timeTaken: 0,
    selectedOptions: [],
})

export const useStateContext = () => {
    const contextValue = useContext(stateContext);
    if (!contextValue) {
        throw new Error('useStateContext must be used within a ContextProvider');
    }

    const { context, setContext } = contextValue;

    return {
        context,
        setContext: (obj: Partial<ContextState>) =>
            setContext((prevContext) => ({
                ...prevContext,
                ...obj,
            })),
        resetContext: () => {
            localStorage.removeItem('context')
            setContext(initialValue())
        },
    }
}

const initialContext = () => {
    const jsonValue = localStorage.getItem('context')

    if (jsonValue != null) {
        return JSON.parse(jsonValue)
    }

    const initial = initialValue()

    localStorage.setItem('context', JSON.stringify(initial))
    return initial
}

export default function ContextProvider({ children }: ContextProviderProps) {
    const [context, setContext] = useState(initialContext())

    useEffect(() => {
        localStorage.setItem('context', JSON.stringify(context))
    }, [context])

    return (
        <stateContext.Provider value={{ context, setContext }}>
            {children}
        </stateContext.Provider>
    )
}
