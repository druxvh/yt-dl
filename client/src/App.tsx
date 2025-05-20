import useDownloader from "./store/store"
import { FiLoader } from "react-icons/fi";

const apiUrl = import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:5000'
console.log(apiUrl)
function App() {

  const { url, videoInfo, format, isLoading, setUrl, setVideoInfo, setFormat, setIsLoading } = useDownloader()

  const handleDownload = async () => {
    if (!url) return alert("Please enter a valid YouTube URL")
    setIsLoading(true)

    try {
      const res = await fetch(`${apiUrl}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })

      if (!res.ok) {
        alert("Failed to fetch video information!")
        return
      }

      const data = await res.json()
      setVideoInfo(data)

    } catch (err) {
      alert("Error fetching video info")
      console.error("Error while fetching the video information: ", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setVideoInfo(null)
  }

  return (
    <div className="min-h-screen px-3 flex items-center justify-center bg-gray-900 font-mono text-white">
      <div className="w-full max-w-lg flex flex-col gap-6">
        <h1 className="py-4 text-xl text-center font-bold">youtubeDL</h1>
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter YouTube URL..."
            className="p-3 flex-1 outline-none bg-gray-800 focus:border-b border-gray-100 rounded-sm"
          />
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="p-3 text-white outline-none bg-gray-800 border-l border-gray-100 cursor-pointer rounded-sm"
          >
            <option value="mp4" className="text-white">Video</option>
            <option value="mp3" className="text-white">Audio</option>
          </select>
        </div>

        <button
          onClick={handleDownload}
          disabled={isLoading || (!!videoInfo && !!url)}
          className={`p-3 bg-blue-700 hover:bg-blue-800 rounded-sm w-full transition
            ${isLoading || (!!videoInfo && !!url) ? "opacity-50 cursor-not-allowed" : "cursor-pointer "}
            `}
        >
          {isLoading ? "Fetching Video Info..." : videoInfo ? "Link Loaded - Click to Download" : "Get Download Link"}
        </button>

        {isLoading && (
          <div className="py-5 flex flex-col gap-4 items-center justify-center text-gray-200 ">
            <FiLoader className="size-8 animate-spin" />
            <p className="animate-pulse">
              Loading... Please wait.
            </p>
          </div>
        )}

        {(!isLoading && videoInfo) ? (
          <div className="p-4 bg-gray-800 rounded-sm">
            <img src={videoInfo.thumbnail_url} alt="Video Thumbnail" className="w-full mb-4 rounded-sm" />
            <p className="text-lg text-pretty font-semibold">{videoInfo.title}</p>
            <a href={`${apiUrl}/api/download?url=${encodeURIComponent(url)}&format=${format}`} download={`download.${format === 'mp3' ? 'mp3' : 'mp4'}`} >
              <button
                className="mt-4 p-3 w-full text-center cursor-pointer bg-green-600 hover:bg-green-700 rounded-sm"> Download {format === 'mp3' ? 'Audio' : 'Video'}
              </button>
            </a>
          </div>
        )
          :
          (
            <div className="min-h-40 flex flex-col justify-center">

              <div className=" w-full min-h-20 p-3 flex flex-col gap-5 rounded bg-gray-800 justify-center font-mono text-sm text-pretty relative">
                <span className="absolute size-[10px] left-[-3px] top-[-2px] bg-gray-200 rounded-full animate-pulse" />
                <p>Just paste the link of your favorite
                  {" "}<span className="text-gray-100 border-b-[1px] border-gray-400">Youtube video</span>,
                  {" "}<span className="text-gray-100 border-b-[1px] border-gray-400">Youtube short</span>, or
                  {" "}<span className="text-gray-100 border-b-[1px] border-gray-400">Youtube music</span>{" "}
                  and download it's high quality audio or video for FREE!
                </p>
                <p>Due to strict YouTube guidelines and security changes, sometimes the server would be down and cause inconvenience to you.</p>
              </div>
            </div>
          )
        }

      </div>
    </div>
  )
}

export default App
