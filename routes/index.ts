import { Express } from "express";
import { v4 as uuid } from "uuid";

export default function (app: Express) {
    app.post("/room/create", (req, res) => {
        // gen room id
        const id = uuid();
        // send it 
        return res.status(200).json({ id });
    });
};