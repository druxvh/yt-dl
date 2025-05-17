import { create } from "zustand"

interface VideoInfo {
    title?: string
    url: string
}

interface DownloadState {
    videoInfo: VideoInfo | null;
    format: string
    setVideoInfo: (info: VideoInfo) => void
    setFormat: (format: string) => void
}

const useDownloader = create<DownloadState>()((set) => ({
    videoInfo: null,
    setVideoInfo: (info) => set({ videoInfo: info }),
    format: "mp4",
    setFormat: (format) => set({ format })
}))

export default useDownloader