import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react"

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const signin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // ユーザー情報を返却
    return userCredential.user;
  } catch (error) {
    console.log(error)
    return null
  }
}

const sessionLogin = async (accessToken) => {
  try {
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [requestResult, setRequestResult] = useState(null)

  const handleSubmitLoginForm = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    try {
      const user = await signin(email, password)
      if (!user) {
        console.log('ログイン失敗')
        return
      }
  
      const session = await sessionLogin(user.accessToken)
      if (!session) {
        console.log('セッション作成失敗')
        return
      }

      console.log("uid: ", user.uid)
      setUser(user)

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

  useEffect(() => {}, [])

  return (
    <>
      <h1>ログイン</h1>
      <form onSubmit={handleSubmitLoginForm}>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">パスワード</label>
        <input type="password" id="password" name="password" />
        <button type="submit">ログイン</button>
      </form>

      <h1>ログインユーザー</h1>
      <p>{user ? "uid: " + user.uid : 'ログインしていません'}</p>
      <button onClick={handleClickGetRequestButton}>Request</button>

      <h1>Request結果</h1>
      <p>{requestResult ? JSON.stringify(requestResult) : '結果なし'}</p>
    </>
  )
}

export default App
