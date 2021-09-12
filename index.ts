import express from "express";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import fallback from "express-history-api-fallback";
import compression from "compression";
import helmet from "helmet";

import io from "./io";
import routes from "./routes";

// dynamic variables
const port = process.env.PORT ?? 3001;
const root = "./client/build";

// initiate server things
const app = express();
const server = http.createServer(app);
const ioServer = new Server(server);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(compression());
app.use(helmet({
    contentSecurityPolicy: false,
}));

// initiate routes
routes(app);
io(ioServer);

app.use(express.static(root));
app.use(fallback("index.html", { root }));

server.listen(port, () => {
    console.log("server listening on", port);
});