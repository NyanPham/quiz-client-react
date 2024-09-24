import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useStateContext } from '../hooks/useStateContext'
import { createAPIEndpoint, ENDPOINTS } from '../api'

const Layout = () => {
    const { context, resetContext } = useStateContext()
    const navigate = useNavigate()

    const logout = async () => {
        try {
            await createAPIEndpoint(ENDPOINTS.logout).post({
                currentUser: context.currentUser,
            })
            resetContext()
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <AppBar position="sticky">
                <Toolbar sx={{ width: 540, m: 'auto' }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ flexGrow: 1 }}
                    >
                        Quiz App
                    </Typography>
                    <Button onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </>
    )
}

export default Layout
