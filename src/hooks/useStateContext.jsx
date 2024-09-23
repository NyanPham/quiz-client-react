import { createContext, useContext, useEffect, useState } from 'react'

const stateContext = createContext()

const initialValue = () => ({
    participantId: 0,
    timeTaken: 0,
    selectedOptions: [],
})

export const useStateContext = () => {
    const { context, setContext } = useContext(stateContext)

    return {
        context,
        setContext: (obj) =>
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

export default function ContextProvider({ children }) {
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
