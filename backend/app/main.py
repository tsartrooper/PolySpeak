from fastapi import FastAPI, Form
from fastapi.responses import StreamingResponse
from indic_transliteration.sanscript import transliterate, DEVANAGARI, ITRANS
import requests
import io
from pydantic import BaseModel

app = FastAPI();


CLOUDFARE_TTS_URL = "https://text-to-speech.prathamesh-tts.workers.dev/"


class SpeakRequest(BaseModel):
    text: str


@app.post("/speak")
async def speak(req: SpeakRequest):
    
    res = requests.post(CLOUDFARE_TTS_URL, json={"text": req.text})
    
    if res.status_code != 200 and res.status_code != 201:
        return {"error": "TTS service failed"}
    
    audio = io.BytesIO(res.content)
    
    return StreamingResponse(audio, media_type="audio/mpeg")