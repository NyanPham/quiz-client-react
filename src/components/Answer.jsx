import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    CardMedia,
    List,
    ListItem,
    Typography,
} from '@mui/material'
import { BASE_URL } from '../api'
import { useState } from 'react'
import { green, red, grey } from '@mui/material/colors'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'

const Answer = ({ questionsWithAnswers }) => {
    const [expanded, setExpanded] = useState(false)

    const handleChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    const markCorrectOrNot = (questionWithAnswer, idx) => {
        if (
            [questionWithAnswer.answer, questionWithAnswer.selected].includes(
                idx
            )
        ) {
            return {
                sx: {
                    color:
                        idx === questionWithAnswer.answer
                            ? green[500]
                            : red[500],
                },
            }
        }
    }

    return (
        <Box sx={{ mt: 5, width: '100%', maxWidth: 640, mx: 'auto' }}>
            {questionsWithAnswers.map((question, idx) => {
                return (
                    <Accordion
                        disableGutters
                        key={idx}
                        expanded={expanded === idx}
                        onChange={handleChange(idx)}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandCircleDownIcon />}
                            sx={{
                                color:
                                    question.answer === question.selected
                                        ? green[500]
                                        : red[500],
                            }}
                        >
                            <Typography sx={{ width: '90%', flexShrink: 0 }}>
                                {question.questionInWords}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: grey[900] }}>
                            {question.imageName ? (
                                <CardMedia
                                    component="img"
                                    image={`${BASE_URL}Images/${question.imageName}`}
                                    sx={{ m: '10px auto', width: 'auto' }}
                                />
                            ) : null}
                            <List>
                                {question.options.map((option, idx) => {
                                    return (
                                        <ListItem key={idx}>
                                            <Typography
                                                {...markCorrectOrNot(
                                                    question,
                                                    idx
                                                )}
                                            >
                                                <b>
                                                    {String.fromCharCode(
                                                        65 + idx
                                                    )}
                                                    . {option}
                                                </b>
                                            </Typography>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Box>
    )
}

export default Answer
