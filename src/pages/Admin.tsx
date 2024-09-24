import {
    AppBar,
    Button,
    Container,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from '@mui/material'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useStateContext } from '../hooks/useStateContext'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import { useState, useEffect } from 'react'

type AdminProps = {}

const Admin = ({}: AdminProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { context, resetContext } = useStateContext()

    const [currentTab, setCurrentTab] = useState(0)

    useEffect(() => {
        if (location.pathname.includes('editQuestion')) {
            setCurrentTab(1)
        } else {
            setCurrentTab(0)
        }
    }, [location.pathname])

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue)
        if (newValue === 0) {
            navigate('/admin')
        } else if (newValue === 1) {
            navigate('/admin/editQuestion')
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
                        Quiz App Admin
                    </Typography>
                    <Button onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Tabs value={currentTab} onChange={handleTabChange} centered>
                    <Tab label="Create Question" />
                    <Tab label="Edit Question" />
                </Tabs>
                <Outlet />
            </Container>
        </>
    )
}

export default Admin
