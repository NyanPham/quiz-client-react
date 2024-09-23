import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Result from './pages/Result'
import Quiz from './pages/Quiz'
import Layout from './components/Layout'
import Register from './pages/Register'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/result" element={<Result />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
