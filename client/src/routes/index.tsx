import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";

const Entry = lazy(() => import("../pages/entry"));
const Room = lazy(() => import("../pages/room"));

export default function Routes() {
    return (
        <Router>
            <ChakraProvider theme={theme}>
                <Suspense fallback={<p>loading...</p>}>
                    <Switch>
                        <Route path="/" exact>
                            <Entry />
                        </Route>
                        <Route path="/room/:id">
                            <Room />
                        </Route>

                        <Route path="*">
                            <h2>404, friend</h2>
                        </Route>
                    </Switch>
                </Suspense>

            </ChakraProvider>
        </Router>
    );
};