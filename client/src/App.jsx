import { Routes, Route, useNavigate } from 'react-router-dom';
import { LoginPage } from "./pages/login";
import { UserPage } from "./pages/user";
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate() 

  const checkUserLogin = async () => {
    try {
        const response = await fetch('http://localhost:8000/user', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await response.json()
        if (data.user) {
            navigate('/user')
            return
        }
    } catch (error) {
        console.log(error)
    }

    navigate('/login')
  }

  useEffect(() => {
    checkUserLogin()
  }, [])

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </div>
  )
}

export default App
