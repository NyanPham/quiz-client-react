import { useEffect, useRef, useState } from 'react'
import { BASE_URL, createAPIEndpoint, ENDPOINTS } from '../api'
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    LinearProgress,
    List,
    ListItemButton,
    Typography,
} from '@mui/material'
import { getFormattedTime } from '../helper'
import { useStateContext } from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom'
import { Question } from '../types'
    
const Quiz = () => {
    const [questions, setQuestions] = useState<Question[]>([])
    const [questionIndex, setQuestionIndex] = useState<number>(0)
    const [timeTaken, setTimeTaken] = useState<number>(0)
    const { context, setContext } = useStateContext()
    const navigate = useNavigate()

    const timer = useRef<ReturnType<typeof setTimeout> | null>()

    const startTimer = () => {
        if (timer.current == null) {
            timer.current = setInterval(() => {
                setTimeTaken((prevTime) => prevTime + 1)
            }, 1000)
        }
    }

    useEffect(() => {
        setContext({
            timeTaken: 0,
            selectedOptions: [],
        })

        const fetchQuestions = async () => {
            try {
                const res = await createAPIEndpoint(ENDPOINTS.questions).fetch()
                setQuestions(res.data)
                startTimer()
            } catch (error) {
                console.error(error)
            }
        }

        fetchQuestions()

        return () => {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }
    }, [])

    const updateAnswer = (questionId: number, optionIndex: number) => {
        const selectedOptions = [...context.selectedOptions]
            
        selectedOptions.push({
            questionId,
            selected: optionIndex,
        })

        if (questionIndex < 4) {
            setContext({ selectedOptions })
            setQuestionIndex((prevIdx) => prevIdx + 1)
        } else {
            setContext({ selectedOptions, timeTaken })
            navigate('/result')
        }
    }

    return questions.length > 0 ? (
        <Card
            sx={{
                width: '640px',
                mx: 'auto',
                mt: '5rem',
                '& .MuiCardHeader-action': { m: '0', alignSelf: 'center' },
            }}
        >
            <CardHeader
                title={`Question ${questionIndex + 1} of 5`}
                action={<Typography>{getFormattedTime(timeTaken)}</Typography>}
            />
            <Box>
                <LinearProgress
                    variant="determinate"
                    value={((questionIndex + 1) / 5) * 100}
                />
            </Box>

            {questions[questionIndex].imageName ? (
                <CardMedia
                    component="img"
                    height="300"
                    image={`${BASE_URL}Images/${questions[questionIndex].imageName}`}
                    alt={questions[questionIndex].questionInWords}
                    sx={{ width: 'auto', m: '10px auto' }}
                />
            ) : null}

            <CardContent>
                <Typography variant="h6">
                    {questions[questionIndex].questionInWords}
                </Typography>
                <List>
                    {questions[questionIndex].options.map((option, index) => (
                        <ListItemButton
                            key={index}
                            disableRipple
                            onClick={() =>
                                updateAnswer(questions[questionIndex].id, index)
                            }
                        >
                            <div>
                                {String.fromCharCode(65 + index)}. {option}
                            </div>
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    ) : null
}

export default Quiz
