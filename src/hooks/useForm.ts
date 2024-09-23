import { ChangeEvent, useState } from 'react'
    
const useForm = <FormState, Errors>(initialState: FormState, initialErrors: Errors) => {
    const [values, setValues] = useState<FormState>(initialState)
    const [errors, setErrors] = useState<Errors>(initialErrors)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues((prevValues) => {
            return { ...prevValues, [name]: value }
        })
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
    }
}

export default useForm
