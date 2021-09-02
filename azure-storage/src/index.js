const express = require("express");
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { response } = require("express");

const app = express();

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

function createBlobService() {
    return BlobServiceClient.fromConnectionString(CONNECTION_STRING);
}

app.get("/video", (req, res) => {
    const videoPath = req.query.path;
    const blobService = createBlobService();
    const containerName = "video";
    const containerClient = blobService.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(videoPath);
    blobClient.getProperties()
        .then((propertiesResponse) => {
            res.writeHead(200, {
                "Content-Length": propertiesResponse.contentLength,
                "Content-Type": "video/mp4",
            });

            blobClient.download(0).then(response => {
                response.readableStreamBody.pipe(res);
            }).catch((err) => {
                console.error(err);
                res.sendStatus(404);
                return;
            })
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(404);
            return;
        });
});

app.listen(PORT, () => {
    console.log(`Microservice online :)`);
});