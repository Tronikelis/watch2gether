import { Express } from "express";
import { v4 as uuid } from "uuid";
import axios from "axios";

export default function (app: Express) {
    app.post("/room/create", (req, res) => {
        // gen room id
        const id = uuid();
        // send it 
        return res.status(200).json({ id });
    });

    // validate video url
    app.post("/room/video/validate", async (req, res) => {
        await axios.get(req.body.url).catch(err => {
            res.sendStatus(403);
            throw err;
        });
        return res.sendStatus(200);
    });
};