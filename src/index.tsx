import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";

import "./css/styles.scss";

ReactDOM.render(<App />, document.getElementById("app"));

module.hot.accept();
