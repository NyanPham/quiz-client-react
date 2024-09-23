import { useEffect, useRef, useState } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import { useStateContext } from '../hooks/useStateContext'
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'
import { getFormattedTime } from '../helper'
import { useNavigate } from 'react-router-dom'
import { green } from '@mui/material/colors'
import Answer from '../components/Answer'
import { QuestionWithAnswer, QuestionWithAnswerAndSelectedOption } from '../types'

const Result = () => {
    const { context, setContext } = useStateContext()
    const [score, setScore] = useState(0)
    const [answers, setAnswers] = useState<QuestionWithAnswerAndSelectedOption[]>([])
    const [showAlert, setShowAlert] = useState(false)
    const navigate = useNavigate()

    const alertTimer = useRef<ReturnType<typeof setTimeout> | null>()

    useEffect(() => {
        const ids = context.selectedOptions.map((x) => x.questionId)

        const fetchAnswers = async () => {
            try {
                const res = await createAPIEndpoint(ENDPOINTS.answers).post(ids)
                const questionsWithAnswers: QuestionWithAnswerAndSelectedOption[] = context.selectedOptions.map(
                    (x) => ({
                        ...x,
                        ...res.data.find((y: QuestionWithAnswer) => y.id === x.questionId),
                    })
                )

                setAnswers(questionsWithAnswers)
                calculateScore(questionsWithAnswers)
            } catch (error) {
                console.error(error)
            }
        }

        fetchAnswers()

        return () => {
            if (alertTimer.current != null) {
                clearTimeout(alertTimer.current)
            }
        }
    }, [])

    const calculateScore = (answersWithSelected : QuestionWithAnswerAndSelectedOption[]) => {
        const totalScore = answersWithSelected.reduce((total, current) => {
            return current.answer === current.selected ? total + 1 : total
        }, 0)

        setScore(totalScore)
    }

    const restart = () => {
        setContext({
            timeTaken: 0,
            selectedOptions: [],
        })

        navigate('/quiz')
    }

    const submitScore = async () => {
        try {
            await createAPIEndpoint(ENDPOINTS.participants).put(
                context.participantId,
                {
                    participantId: context.participantId,
                    score,
                    timeTaken: context.timeTaken,
                }
            )
            setShowAlert(true)
            if (alertTimer.current != null) {
                clearTimeout(alertTimer.current)
            }

            alertTimer.current = setTimeout(() => {
                setShowAlert(false)
            }, 3000)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Card
                sx={{
                    mt: 5,
                    display: 'flex',
                    width: '100%',
                    maxWidth: 640,
                    mx: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                        <Typography variant="h4">Congratulations!</Typography>
                        <Typography variant="h6">YOUR SCORE</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            <Typography variant="inherit" color={green[500]}>
                                {score}
                            </Typography>
                        </Typography>
                        <Typography variant="h6">
                            Took {getFormattedTime(context.timeTaken) + ' mins'}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mx: 1 }}
                            size="small"
                            onClick={submitScore}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ mx: 1 }}
                            size="small"
                            onClick={restart}
                        >
                            Re-try
                        </Button>
                        {showAlert && <Alert
                            severity="success"
                            variant="filled"
                            sx={{ width: '60%', m: 'auto' }}
                        >
                            Score updated
                        </Alert>}
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ width: 220 }}
                    image="./result.png"
                />
            </Card>
            <Answer questionsWithAnswers={answers} />
        </>
    )
}

export default Result
