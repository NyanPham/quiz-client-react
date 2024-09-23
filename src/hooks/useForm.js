import { useState } from 'react'

const useForm = (initialState) => {
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})

    const handleInputChange = (e) => {
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
