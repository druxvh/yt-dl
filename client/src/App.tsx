import { useState } from "react"
import useDownloader from "./store/store"

function App() {
  const [url, setUrl] = useState<string>("")
  const { format, setFormat, videoInfo, setVideoInfo } = useDownloader()

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/download', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format })
      })
      const data = await res.json()
      setVideoInfo(data)

    } catch (error) {
      console.error("Download failed...", error)
    }
  }


  return (
    <div className="min-h-screen flex justify-center bg-gray-900 font-mono text-white">
      <div className="w-3xl flex flex-col gap-10">
        <h1 className="py-8 text-xl text-center">youtubeDL</h1>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Youtube link..."
            className="p-2 flex-1 outline-none focus:border-b"
          />
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="px-4 text-white outline-none border-l cursor-pointer"
          >
            <option value="mp4" className="text-black">Video</option>
            <option value="mp3" className="text-black">Audio</option>
          </select>
        </div>

        <button
          onClick={handleDownload}
          className="p-2 bg-blue-700 hover:bg-blue-800 rounded w-full cursor-pointer"
        >
          Download
        </button>

        {videoInfo &&
          <div className="mt-4">
            <a
              href={videoInfo.url}
              download
              className="text-blue-300 hover:underline"
            >
              {videoInfo.title}
            </a>
          </div>
        }
      </div>
    </div>
  )
}

export default App
