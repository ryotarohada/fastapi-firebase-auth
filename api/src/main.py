import datetime
from fastapi import FastAPI, Depends, HTTPException, status, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# サーバーの起動
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# リクエストボディの定義
class Message(BaseModel):
    name: str

# セッション検証関数の定義
def verify_session(session_token: str = Cookie(None)):
    if not session_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        cred = auth.verify_session_cookie(session_token)
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return cred

@app.post("/login")
def login(res: Response, cred: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    if not cred:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        expires_in = datetime.timedelta(days=5)
        session_cookie = auth.create_session_cookie(cred.credentials, expires_in=expires_in)
        res.set_cookie(
            key="session_token",
            value=session_cookie,
            expires=expires_in,
            httponly=True,
            secure=True,
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return {"message": "Login success"}

@app.get("/user")
def get_user(cred = Depends(verify_session)):
    return {"user": cred}

# getを定義
@app.get("/hello")
def read_root(cred = Depends(verify_session)):
    uid = cred.get("uid")
    return {"message": f"Hello, {uid}!"}

# postを定義
@app.post("/hello")
def create_message(message: Message, cred = Depends(verify_session)):
    uid = cred.get("uid")
    return {"message": f"Hello, {message.name}! Your uid is [{uid}]"}