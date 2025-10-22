import logo from './logo.svg';
import './App.css';
import axios from "axios";
import { useState } from 'react';

function App() {

  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleSpeak = async() =>{

    if(!text.trim()) return;
    setLoading(true);
    try{
      const response = await axios.post("http://localhost:8000/speak", { text }, {
        responseType: "blob"
      });

      const url = URL.createObjectURL(response.data);
      console.log("url:",url)
      setAudioUrl(url);
    }
    catch(err){
      console.error("Error generating speech:", err);
      setLoading(false)
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">PolySpeak 🔈</h1>
      <textarea
        rows={4}
        className="w-full max-w-xl p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type something in English, Hindi or mixed"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
      onClick = {handleSpeak}
      className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
      disabled={loading}
      >
        {loading? "loading..." : "speak"}
        </button> 

      {audioUrl && (
        <div className="mt-6">
          <audio key={audioUrl} controls src={audioUrl}
          ></audio>
          </div>
      )}


    </div>
    

  );
}

export default App;
