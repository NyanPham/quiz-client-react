import { TextField, Button, Box, Card, CardContent, Typography } from '@mui/material'
import Center from './Center'
import useForm from '../hooks/useForm'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import { useStateContext } from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom'

const inititalState = {
    email: '',
    name: ''
}

const Login = () => {
    const { context, setContext } = useStateContext()
    const navigate = useNavigate()

   const { 
        values, 
        setValues, 
        errors, 
        setErrors, 
        handleInputChange 
    } = useForm(inititalState)

    const login = async (e) => {
        e.preventDefault()

        if (!validate()) {
            return;
        }
        
        try {
            const res = await createAPIEndpoint(ENDPOINTS.participants).post({
                email: values.email,
                name: values.name
            })
            setContext({ participantId: res.data.id })
            navigate('/quiz')
        } catch (err) {
            console.log(err)
        }
    }

    const validate = () => {
        let temp = {}
        temp.email = (/\S+@\S+\.\S+/).test(values.email) ? null : 'Email is not valid',
        temp.name = values.name ? null : 'Name is required'

        setErrors(temp)
        return Object.values(temp).every(x => x === '' || x == null)             
    }

  return (
    <Center>
        {context.participantId}
        <Card sx={{ width: '400px' }}>
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ my:3 }}>Quizz App</Typography>
                <Box sx={{ 
                    '& .MuiTextField-root': {
                        margin: 1,
                        width: '90%'
                    }
                }}>
                    <form noValidate autoComplete='off' onSubmit={login}>
                        <TextField label="Email" name="email" variant="outlined" value={values.email} onChange={handleInputChange} {...(errors.email && { error: true, helperText: errors.email })} />
                        <TextField label="Name" name="name" variant="outlined" value={values.name} onChange={handleInputChange} {...(errors.name && { error: true, helperText: errors.name })}/>
                        <Button type="submit" variant="contained" size="large" sx={{width: '90%'}}>Start</Button>
                    </form>
                </Box>
            </CardContent>
        </Card>
    </Center>
  )
}

export default Login