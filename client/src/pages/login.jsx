import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase-methods";
import { useEffect } from "react";

export const LoginPage = () => {

    const navigate = useNavigate()
    
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
        navigate('/user')
  
      } catch (error) {
        console.log(error)
      }
    }

    return (
        <div>
            <h1>ログイン</h1>
            <form onSubmit={handleSubmitLoginForm}>
              <label htmlFor="email">メールアドレス</label>
              <input type="email" id="email" name="email" />
              <br />
              <label htmlFor="password">パスワード</label>
              <input type="password" id="password" name="password" />
              <br />
              <button type="submit">ログイン</button>
            </form>
        </div>
    )
}