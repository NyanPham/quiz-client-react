import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Result from './pages/Result'
import Quiz from './pages/Quiz'
import Layout from './pages/Layout'
import Register from './pages/Register'
import Admin from './pages/Admin'
import CreateQuestion from './pages/CreateQuestion'
import EditQuestion from './pages/EditQuestion'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="result" element={<Result />} />
                </Route>
                <Route path="/admin" element={<Admin />}>
                    <Route index element={<CreateQuestion />} />
                    <Route path="editQuestion" element={<EditQuestion />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
