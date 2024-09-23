import jwtDecode from 'jwt-decode';
import {
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Typography,
} from '@mui/material'
import Center from '../components/Center'
import useForm from '../hooks/useForm'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import { useStateContext } from '../hooks/useStateContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, FormEvent } from 'react'

// Define types for the initial state, values, and errors
type FormState = {
    email: string
    password: string
    passwordConfirm: string
}

type Errors = {
    email: string | null
    password: string | null
    passwordConfirm: string | null
};

const initialState: FormState = {
    email: '',
    password: '',
    passwordConfirm: '',
};

const Register = () => {
    const { context, setContext, resetContext } = useStateContext()
    const navigate = useNavigate()

    const { values, setValues, errors, setErrors, handleInputChange } =
        useForm<FormState, Errors>(initialState, { email: null, password: null, passwordConfirm: null })

    useEffect(() => {
        resetContext()
    }, [])

    const register = async (e: FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        try {
            const res = await createAPIEndpoint(ENDPOINTS.register).post({
                email: values.email,
                password: values.password,
                passwordConfirm: values.passwordConfirm,
            }) 
            
            setContext({ 
                participantId: res.data.id, 
                authToken: res.data.token, 
                currentUser: res.data.currentUser 
            })
            navigate('/quiz')
        } catch (err) {
            console.log(err)
        }
    }

    const validate = () => {
        let temp: Errors = { email: null, password: null, passwordConfirm: null }
        temp.email = /\S+@\S+\.\S+/.test(values.email)
            ? null
            : 'Email is not valid'
        temp.password = values.password ? null : 'Password is required'
        temp.passwordConfirm = values.password != null && values.password !== values.passwordConfirm ? 'Passwords do not match' : null

        setErrors(temp)
        return Object.values(temp).every((x) => x === null)
    }

    return (
        <Center>
            <Card sx={{ width: '400px' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ my: 3 }}>
                        Quizz App
                    </Typography>
                    <Box
                        sx={{
                            '& .MuiTextField-root': {
                                margin: 1,
                                width: '90%',
                            },
                        }}
                    >   
                        <form noValidate autoComplete="off" onSubmit={register}>
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                value={values.email}
                                onChange={handleInputChange}
                                {...(errors.email && {
                                    error: true,
                                    helperText: errors.email,
                                })}
                            />
                            <TextField
                                label="Password"
                                name="password"
                                variant="outlined"
                                type='password'
                                value={values.password}
                                onChange={handleInputChange}
                                {...(errors.password && {
                                    error: true,
                                    helperText: errors.password,
                                })}
                            />
                            <TextField
                                label="Password Confirm"
                                name="passwordConfirm"
                                variant="outlined"
                                type='password'
                                value={values.passwordConfirm}
                                onChange={handleInputChange}
                                {...(errors.passwordConfirm && {
                                    error: true,
                                    helperText: errors.passwordConfirm,
                                })}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ width: '90%' }}
                            >
                                Create Account
                            </Button>
                        </form>
                    </Box>  
                    <Box sx={{ mt: 1 }}>
                        Don't have an account? <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Login
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    )
}

export default Register