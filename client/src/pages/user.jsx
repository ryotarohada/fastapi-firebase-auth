import { useEffect, useState } from "react"

export const UserPage = () => {
    const [user, setUser] = useState(null)
    const [requestResult, setRequestResult] = useState(null)

    const fetchUser = async () => {
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
            console.log(data.user)
            setUser(data.user)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickGetRequestButton = async () => {
      const response = await fetch('http://localhost:8000/hello', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
  
      const data = await response.json()
      setRequestResult(data)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <div>
            <h1>ログインユーザー</h1>
            <p>
                {user ? (
                    <>
                        <span>uid: {user.uid}</span>
                        <br />
                        <span>email: {user.email}</span>
                    </>
                ) : 'ログインしていません'}
            </p>
            <button onClick={handleClickGetRequestButton}>Request</button>
        
            <h1>Request結果</h1>
            <p>{requestResult ? JSON.stringify(requestResult) : '結果なし'}</p>
        </div>
    )
}