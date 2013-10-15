/*
 * Copyright 2013 BlackBerry Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var express = require("express"),
    cp = require("child_process"),
    os = require("os"),
    fs = require("fs"),
    path = require("path"),
    config = require("../config.json"),
    app = express(),
    routePath = path.resolve("routes"),
    routes = fs.readdirSync(routePath),
    port = config.port ? config.port : 3000,
    command = os.type().toLowerCase().indexOf("windows") >= 0 ? "start" : "open";

app.use(express.static(path.resolve(__dirname, path.join("..", "public"))));

app.configure(function () {
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
});

app.get("/", function (req, res) {
    res.sendfile(path.resolve(__dirname, path.join("..", "public", "index.html")));
});

routes.forEach(function (file) {
    var route = require(path.resolve(routePath, file));
    Object.getOwnPropertyNames(route).forEach(function (cmd) {
        app[cmd]("/" + path.basename(file, '.js'), route[cmd]);
    });
});

app.listen(port);
console.log("Listening on port " + port);

cp.exec(command + " http://localhost:" + port);