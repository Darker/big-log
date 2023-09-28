import path from "path"
import * as url from 'url';

import express from "express"

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const HTTP_PORT = 1*process.env.PORT * 1 || 8080;

const ALLOWED_ORIGINS = [];

const app = express();

// Handles allowed origins for CORS (does not prevent embedding of images)
app.use((req, res, next) => {
    if (ALLOWED_ORIGINS.includes(req.headers.origin)) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Access-Control-Max-Age', '86400');
    }
    if(req.method == "OPTIONS") {
        res.status(200).send();
    }
    else {
        next();
    }
});

app.use("/", express.static(path.join(__dirname, "../web")));
app.use("/sample/", express.static(path.join(__dirname, "../sample")));

app.listen(HTTP_PORT, (err)=>{
    if(err) {
        console.error(`Failed to listen on ${HTTP_PORT}`);
    }
    else {
        console.info(`Listening on localhost:${HTTP_PORT}`);
    }
});
