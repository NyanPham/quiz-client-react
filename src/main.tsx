import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import ContextProvider from './hooks/useStateContext.js'
    
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'IBM Plex Sans',
    },
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ContextProvider>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </ContextProvider>
    </StrictMode>
)
