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
}

type Errors = {
    email: string | null
    password: string | null
}

const initialState: FormState = {
    email: '',
    password: '',
}

const Login = () => {
    const { setContext, resetContext } = useStateContext()
    const navigate = useNavigate()

    const { values, errors, setErrors, handleInputChange } = useForm<
        FormState,
        Errors
    >(initialState, { email: null, password: null })

    useEffect(() => {
        resetContext()
    }, [])

    const login = async (e: FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        try {
            const res = await createAPIEndpoint(ENDPOINTS.login).post({
                email: values.email,
                password: values.password,
            })

            const { id, token, currentUser } = res.data

            setContext({
                participantId: id,
                authToken: token,
                currentUser: currentUser,
            })

            if (currentUser.role.toLowerCase() === 'admin') {
                return navigate('/admin')
            }

            navigate('/quiz')
        } catch (err) {
            console.log(err)
        }
    }

    const validate = () => {
        let temp: Errors = { email: null, password: null }
        temp.email = /\S+@\S+\.\S+/.test(values.email)
            ? null
            : 'Email is not valid'
        temp.password = values.password ? null : 'Name is required'

        setErrors(temp)
        return Object.values(temp).every((x) => x === null)
    }

    return (
        <Center>
            <Card sx={{ width: '400px' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ my: 3 }}>
                        Sign in
                    </Typography>
                    <Box
                        sx={{
                            '& .MuiTextField-root': {
                                margin: 1,
                                width: '90%',
                            },
                        }}
                    >
                        <form noValidate autoComplete="off" onSubmit={login}>
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
                                type="password"
                                value={values.password}
                                onChange={handleInputChange}
                                {...(errors.password && {
                                    error: true,
                                    helperText: errors.password,
                                })}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ width: '90%', mt: 1 }}
                            >
                                Start
                            </Button>
                        </form>
                    </Box>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            mt: 2,
                            mb: 1,
                        }}
                    />
                    <Box sx={{ mt: 1 }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Typography
                                variant="subtitle1"
                                display="inline"
                                sx={{
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Register
                            </Typography>
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Center>
    )
}

export default Login
