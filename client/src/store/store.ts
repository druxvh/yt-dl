import { create } from "zustand"

interface VideoInfo {
    title?: string
    thumbnail_url?: string
    video_url?: string
}

interface DownloadState {
    url: string
    videoInfo: VideoInfo | null;
    format: string
    isLoading: boolean
    setUrl: (link: string) => void
    setVideoInfo: (info: VideoInfo | null) => void
    setFormat: (format: string) => void
    setIsLoading: (bool: boolean) => void
}

const useDownloader = create<DownloadState>()((set) => ({
    url: '',
    videoInfo: null,
    format: "mp4",
    isLoading: false,
    setUrl: (link) => set({ url: link }),
    setVideoInfo: (info) => set({ videoInfo: info }),
    setFormat: (format) => set({ format }),
    setIsLoading: (bool) => set({ isLoading: bool })
}))

export default useDownloader