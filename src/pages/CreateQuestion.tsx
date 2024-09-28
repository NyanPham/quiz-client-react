import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../hooks/useStateContext'
import { useEffect, useRef, useState } from 'react'
import { QuestionToCreate } from '../types'
import { Box, Button, TextField, Typography } from '@mui/material'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import OptionField from '../components/OptionField'
import useForm from '../hooks/useForm'
import { createAPIEndpoint, ENDPOINTS } from '../api'

const initialQuestionData: QuestionToCreate = {
    questionInWords: '',
    image: null,
    options: [],
    answer: 0,
}

type Errors = {
    questionInWords: string
    options: string[]
    answer: string
}

const CreateQuestion = () => {
    const {
        context: { currentUser, authToken },
    } = useStateContext()
    const navigate = useNavigate()

    const {
        values: question,
        setValues: setQuestion,
        errors,
        setErrors,
        handleInputChange,
    } = useForm<QuestionToCreate, Errors>(initialQuestionData, {
        questionInWords: '',
        options: [],
        answer: '',
    })

    const [optionCount, setOptionCount] = useState<number>(1)

    const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>()

    useEffect(() => {
        if (
            currentUser?.roles.every(
                (role) => role.toLowerCase() !== 'admin'
            ) ||
            authToken == null
        ) {
            if (navigateTimer.current) {
                clearTimeout(navigateTimer.current)
            }

            navigateTimer.current = setTimeout(() => {
                navigate('/')
            }, 3000)
        }

        return () => {
            if (navigateTimer.current) {
                clearTimeout(navigateTimer.current)
            }
        }
    }, [])

    if (
        currentUser?.roles.every((role) => role.toLowerCase() !== 'admin') ||
        authToken == null
    ) {
        return <div>Unauthorized</div>
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validate()) return

        const formData = new FormData()

        formData.append('QuestionInWords', question.questionInWords)
        formData.append(
            'Options',
            question.options.join('**OPTION_DELIMITER**')
        )
        formData.append('Answer', question.answer.toString())

        if (question.image != null) {
            formData.append('Image', question.image)
        }

        try {
            const res = await createAPIEndpoint(ENDPOINTS.questions)
                .withAuth(authToken)
                .post(formData)
        } catch (err) {
            // Handle error
        }

        try {
            const res = await createAPIEndpoint(ENDPOINTS.questions).post(
                formData
            )

            console.log(res)
        } catch (err) {}
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setQuestion((prevQuestion) => ({
            ...prevQuestion,
            image: file,
        }))
    }

    const validate = () => {
        let temp: Errors = {
            questionInWords: '',
            options: [],
            answer: '',
        }

        temp.questionInWords = question.questionInWords
            ? ''
            : 'This field is required.'

        question.options.forEach((option, idx) => {
            if (!option || option === '') {
                temp.options[idx] = 'This field is required.'
            }
        })

        temp.answer = question.answer ? '' : 'Correct answer index is required.'

        setErrors(temp)

        return Object.values(temp).map((x) => {
            if (Array.isArray(x)) {
                return x.length === 0
            }

            return x == null || x === ''
        })
    }

    const handleOptionChange = (idx: number, value: string) => {
        setQuestion((prevQuestion) => {
            const newOptions = [...prevQuestion.options]
            newOptions[idx] = value

            return {
                ...prevQuestion,
                options: newOptions,
            }
        })
    }

    const handleDeleteOption = (idx: number) => {
        setQuestion((prevQuestion) => ({
            ...prevQuestion,
            options: prevQuestion.options.filter(
                (_, optionIdx) => idx !== optionIdx
            ),
        }))
        setOptionCount((prev) => prev - 1)
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="h5" align="left" sx={{ flexGrow: 1, mt: 2 }}>
                Create New Question
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="questionInWords"
                label="Question In Words"
                name="questionInWords"
                autoComplete="questionInWords"
                value={question.questionInWords}
                onChange={handleInputChange}
                {...(errors.questionInWords && {
                    error: true,
                    helperText: errors.questionInWords,
                })}
            />
            <TextField
                type="file"
                margin="normal"
                required
                fullWidth
                id="image"
                label="Image"
                name="image"
                autoComplete="image"
                onChange={handleFileChange}
            />
            {Array.from({ length: optionCount }).map((_, idx) => (
                <OptionField
                    key={idx}
                    idx={idx}
                    optionValue={question.options[idx] || ''}
                    handleOptionChange={handleOptionChange}
                    handleDeleteOption={handleDeleteOption}
                    showDeleteButton={optionCount > 1}
                    error={errors.options[idx] || ''}
                />
            ))}
            <Button
                type="button"
                onClick={() => setOptionCount((prev) => prev + 1)}
                variant="contained"
                startIcon={<AddCircleOutline />}
                sx={{ mt: 2 }}
            >
                Add Option
            </Button>
            <TextField
                type="number"
                margin="normal"
                required
                fullWidth
                id="answer"
                label="Answer"
                name="answer"
                autoComplete="answer"
                value={question.answer}
                onChange={handleInputChange}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create Question
            </Button>
        </Box>
    )
}

export default CreateQuestion
