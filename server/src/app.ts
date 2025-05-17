import express, { Request, Response } from "express"
import cors from "cors"
import ytdl from "@distube/ytdl-core";

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173'], // Allow requests only from these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies, if your application uses them
    optionsSuccessStatus: 204,
    // headers: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/download", async (req: Request, res: Response) => {
    const { url, format } = req.body

    try {
        // validates youtube url
        if (!ytdl.validateURL(url)) {
            res.status(400).json({ error: "Invalid URL" })
            return
        }
        // gets the video
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title

        // sets header to let browser know bout the downloadable attachment file
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${title}.${format}"`
        )

        const stream = ytdl(url, {
            filter: format === 'mp3' ? 'audioonly' : 'audioandvideo',
            quality: format === 'mp3' ? 'highestaudio' : 'highestvideo'
        })

        stream.pipe(res)

    } catch (error) {
        console.error("Error processing video:", error);
        res.status(500).json({ error: "Error processing video" })
    }
})

app.listen(5000, () => {
    console.log(`Server running on 5000`)
})