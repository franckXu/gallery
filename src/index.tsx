import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './app';
// import App from "./gallery.class";
// import App from "./app.render-time.commit-time";
// import App from "./app-react-memo-equal"; // 1
// import App from "./app-react-memo-useCallback"; // 2
// import App from "./app-react-memo-useState"; // 3
import App from "./app-useCallback-depend"; // 4
// import App from "./app-useMemo"; // 5
// import App from "./app-object-refer";  // 6

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
