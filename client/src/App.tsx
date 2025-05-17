import { useState } from "react"
import useDownloader from "./store/store"

function App() {
  const [url, setUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { format, setFormat, setVideoInfo } = useDownloader()

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/download', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format })
      })

      if (!res.ok) {
        throw new Error("Failed to download")
      }
      // blob is binary large object (immutable, file like data type)
      const blob = await res.blob()

      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `download.${format}`
      link.click()

      setVideoInfo({ url: downloadUrl })

    } catch (error) {
      console.error("Download failed...", error)
    } finally {
      setIsLoading(false)
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
          className={`p-2 bg-blue-700 hover:bg-blue-800 rounded w-full cursor-pointer 
            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Downloading..." : "Download"}
        </button>

        {isLoading && (
          <div className="text-center mt-4 animate-pulse">Downloading... Please wait.</div>
        )}
      </div>
    </div>
  )
}

export default App
