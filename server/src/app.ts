import express, { Request, Response } from "express"
import cors from "cors"
import ytdl, { downloadOptions } from "@distube/ytdl-core";
import { promisify } from "util";
import { pipeline } from "stream";
import dotenv from "dotenv"
dotenv.config()

const port = process.env.PORT || 5000
const app = express()
const asyncPipeline = promisify(pipeline)

const corsOptions = {
    origin: ['http://localhost:5173', process.env.CLIENT_URL], // Allow requests only from these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies, if your application uses them
    optionsSuccessStatus: 204,
    // headers: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};

app.use(cors(corsOptions))
app.use(express.json())

// download video/audio
app.get("/api/download", async (req: Request, res: Response) => {
    const { url, format } = req.query

    // validates youtube url
    if (!ytdl.validateURL(String(url))) {
        res.status(400).json({ error: "Invalid URL" })
        return
    }
    try {
        // ytdl options
        const options: downloadOptions = {
            filter: format === 'mp3' ? 'audioonly' : 'audioandvideo',
            quality: format === 'mp3' ? 'highestaudio' : 'highestvideo'
        }
        const videoInfo = await ytdl.getInfo(String(url))
        const formatInfo = ytdl.chooseFormat(videoInfo.formats, options)
        // sets header to let browser know bout the downloadable attachment file
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="download.${format === 'mp3' ? 'mp3' : 'mp4'}"`
        )
        // header to let browser know bout the content type of the data
        res.setHeader(
            "Content-Type", format === 'mp3' ? 'audio/mpeg' : 'video/mp4'
        )
        // set content-length header only if available
        if (formatInfo.contentLength) {
            res.setHeader("Content-Length", formatInfo?.contentLength);
        }

        const stream = ytdl(String(url), options)
        await asyncPipeline(stream, res)

    } catch (err) {
        res.status(500).json({ error: "Error processing video", err })
    }
})

// get video details from the url
app.post('/api/info', async (req: Request, res: Response) => {
    const { url } = req.body
    try {
        const videoInfo = await ytdl.getInfo(url)
        res.status(200).json({
            title: videoInfo.videoDetails.title,
            thumbnail_url: videoInfo.videoDetails.thumbnails[0].url,
            video_url: videoInfo.videoDetails.video_url
        })
    } catch (err) {
        res.status(500).json({ error: "Error retrieving video info", err })
    }
})

app.listen(port, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})