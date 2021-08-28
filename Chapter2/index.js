const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 3000;

app.get('/video', (req, res) => {
    const PATH = "./video/SampleVideo_1280x720_1mb.mp4";
    fs.stat(PATH, (err, stats) => {
        if(err){
            console.log("An error occured");
            res.sendStatus(500);
            return;
        }

        res.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": "video/mp4",
        });

        fs.createReadStream(PATH).pipe(res);
    })
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
