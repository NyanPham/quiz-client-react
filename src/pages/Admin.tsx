import { useNavigate } from "react-router-dom"
import { useStateContext } from "../hooks/useStateContext"
import { useEffect, useRef, useState } from "react"
import { QuestionToCreate } from "../types"
import { Box, Button, TextField } from "@mui/material"
import AddCircleOutline from "@mui/icons-material/AddCircleOutline"
import DeleteOutline from "@mui/icons-material/DeleteOutline"

type AdminProps = {}

const Admin = ({}: AdminProps) => {
    const { context, setContext } = useStateContext()
    const currentUser = context.currentUser
    const navigate = useNavigate()

    const [question, setQuestion] = useState<QuestionToCreate>({
        questionInWords: '',
        imageName: '',
        options: [],
        answer: 0,
    })        

    const [optionCount, setOptionCount] = useState<number>(1)

    const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>()

    useEffect(() => {
        if (currentUser?.role.toLowerCase() !== 'admin') {
            if (navigateTimer.current) {
                clearTimeout(navigateTimer.current)
            }
    
            navigateTimer.current = setTimeout(() => {
                navigate("/")
            }, 3000)
        }  
            
        return () => {
            if (navigateTimer.current) {
                clearTimeout(navigateTimer.current)
            }
        }
    }, [])
                        
    if (currentUser?.role.toLowerCase() !== 'admin') {
        return <div>Unauthorized</div>
    }       
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(question)
    }           

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="questionInWords"
                label="Question In Words"
                name="questionInWords"
                autoComplete="questionInWords"
                value={question.questionInWords}
                onChange={(e) => setQuestion(prevQuestion => ({ ...prevQuestion, questionInWords: e.target.value }))}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="imageName"
                label="Image Name"
                name="imageName"
                autoComplete="imageName"
                value={question.imageName}
                onChange={(e) => setQuestion(prevQuestion => ({ ...prevQuestion, imageName: e.target.value }))}
            />
            {Array.from({ length: optionCount }).map((_, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={`option${idx + 1}`}
                        label={`Option ${idx + 1}`}
                        name={`option${idx + 1}`}
                        autoComplete={`option${idx + 1}`}
                        value={question.options[idx] || ''}
                        onChange={(e) => {
                                setQuestion(prevQuestion => {
                                    const newOptions = [...prevQuestion.options]
                                    newOptions[idx] = e.target.value
                                    
                                    return {
                                        ...prevQuestion,
                                        options: newOptions,
                                    }
                                })
                            }
                        }
                    />  
                    {optionCount > 1 && (
                        <Button
                            type="button"
                            onClick={() => {
                                setQuestion(prevQuestion => ({
                                    ...prevQuestion,
                                    options: prevQuestion.options.filter((_, optionIdx) => idx !== optionIdx),
                                }));
                                setOptionCount((prev) => prev - 1);
                            }}
                            variant="contained"
                            color="error"
                            sx={{ ml: 1, maxWidth: 'max-content' }}
                            startIcon={<DeleteOutline />}
                        />
                    )}
                </Box>
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
                onChange={(e) => setQuestion(prevQuestion => ({ ...prevQuestion, answer: parseInt(e.target.value) }))}
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

export default Admin
