import React from "react";
import ReactDOM from "react-dom";
import { ColorModeScript } from "@chakra-ui/color-mode";

import Routes from "./routes";

ReactDOM.render(
    <>
        <ColorModeScript initialColorMode="dark" />
        <Routes />
    </>,
    document.getElementById("root")
);