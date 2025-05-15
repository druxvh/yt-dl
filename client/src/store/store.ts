import { create } from "zustand"

interface DownloadState {
    videoInfo: string | null;
    setVideoInfo: (info: string) => void
    format: string
    setFormat: (format: string) => void
}

const useDownloader = create<DownloadState>()((set) => ({
    videoInfo: null,
    setVideoInfo: (info) => set({ videoInfo: info }),
    format: "mp4",
    setFormat: (format) => set({ format })
}))

export default useDownloader