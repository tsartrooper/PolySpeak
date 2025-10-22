from fastapi import FastAPI, Form
from fastapi.responses import StreamingResponse
from indic_transliteration.sanscript import transliterate, DEVANAGARI, ITRANS
import requests
import io
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI();

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ployspeak.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


CLOUDFARE_TTS_URL = "https://text-to-speech.prathamesh-tts.workers.dev/"


class SpeakRequest(BaseModel):
    text: str




@app.post("/speak")
async def speak(req: SpeakRequest):
    
    roman_text = transliterate(req.text, DEVANAGARI, ITRANS)
    
    res = requests.post(CLOUDFARE_TTS_URL, json={"text": roman_text})
    
    if res.status_code != 200 and res.status_code != 201:
        return {"error": "TTS service failed"}
    
    audio = io.BytesIO(res.content)
    
    return StreamingResponse(audio, media_type="audio/mpeg")