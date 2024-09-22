import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Result from "./components/Result"
import Quiz from "./components/Quiz"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
