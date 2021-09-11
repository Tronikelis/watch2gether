import express from "express";
import morgan from "morgan";
import fallback from "express-history-api-fallback";

import routes from "./routes";

const port = process.env.PORT ?? 3000;
const root = "./client/build";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

routes(app);

app.use(express.static(root));
app.use(fallback("index.html", { root }));

app.listen(port, () => {
    console.log("Listening on", port);
});