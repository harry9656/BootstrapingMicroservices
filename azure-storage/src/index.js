const express = require("express");
const azure = require("azure-storage");

const app = express();

if (!process.env.PORT) {
    throw new Error("PORT variable not set!");
}

const PORT = process.env.PORT;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;

function createBlobService() {
    return azure.createBlobService(STORAGE_ACCOUNT_NAME, STORAGE_ACCESS_KEY);
}

app.get("/video", (req, res) => {
    const videoPath = req.query.path;
    const blobService = createBlobService();

    const containerName = "video";
    blobService.getBlobProperties(containerName, videoPath, (err, properties) => {
        if (err) {
            res.sendStatus(500);
            return;
        }

        res.writeHead(200, {
            "Content-Length": properties.contentLength,
            "Content-Type": "video/mp4",
        });

        blobService.getBlobToStream(containerName,
            videoPath, res, err => {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
            })
    })
});

app.listen(PORT, () => {
    console.log(`Azure storeage online on PORT: ${PORT}`);
});