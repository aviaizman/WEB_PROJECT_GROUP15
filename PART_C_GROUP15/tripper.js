import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sql from "./db.js";


const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(publicPath));

// Page routes
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/upload", (req, res) => {
    res.sendFile(path.join(publicPath, "upload.html"));
});

app.get("/GetHomeRoutes", (req, res) => {
    sql.query("SELECT * FROM routes ORDER BY id ASC LIMIT 6", (err, mysqlres) => {
        if (err) {
            console.log("Error loading home routes:", err);
            return res.status(400).json({
                success: false,
                message: "Error loading home routes from database"
            });
        }

        return res.json({
            success: true,
            message: "Home routes loaded from database",
            routes: mysqlres
        });
    });
});

app.get("/SearchRoutes", (req, res) => {
    const { region, difficulty, duration } = req.query;
    let query = "SELECT * FROM routes WHERE 1=1";
    const values = [];

    console.log(req.query);

    if (region && region !== "any") {
        query += " AND region = ?";
        values.push(region);
    }

    if (difficulty && difficulty !== "any") {
        query += " AND difficulty = ?";
        values.push(difficulty);
    }

    if (duration && duration !== "any") {
        if (duration === "short") {
            query += " AND duration_hours <= 2";
        } else if (duration === "medium") {
            query += " AND duration_hours > 2 AND duration_hours <= 5";
        } else if (duration === "long") {
            query += " AND duration_hours > 5";
        }
    }

    sql.query(query, values, (err, mysqlres) => {
        if (err) {
            console.log("Error searching routes:", err);
            return res.status(400).json({
                success: false,
                message: "Error loading search results from database"
            });
        }

        return res.json({
            success: true,
            message: "Search results loaded from database",
            routes: mysqlres
        });
    });
});

app.post("/LoginUser", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All login fields are required"
        });
    }

    sql.query(
        "SELECT * FROM users WHERE username = ? AND email = ? AND password = ?",
        [username, email, password],
        (err, mysqlres) => {
            if (err) {
                console.log("Error logging in user:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error logging in"
                });
            }

            if (mysqlres.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "One or more login details are incorrect"
                });
            }

            const user = mysqlres[0];

            return res.json({
                success: true,
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    );
});

app.post("/CreateNewRoute", (req, res) => {
    const {
        routeName,
        routeRegion,
        routeDifficulty,
        routeDuration,
        routeDescription
    } = req.body;
    const selectedFeatures = req.body.routeFeatures
        ? Array.isArray(req.body.routeFeatures)
            ? req.body.routeFeatures
            : [req.body.routeFeatures]
        : [];

    console.log(req.body);

    if (!routeName || !routeRegion || !routeDifficulty || !routeDuration || !routeDescription) {
        return res.status(400).json({
            success: false,
            message: "All route fields are required"
        });
    }

    const trimmedRouteName = routeName.trim();
    const trimmedRouteDescription = routeDescription.trim();
    const routeDurationNumber = Number(routeDuration);
    const validRegions = ["north", "center", "south", "jerusalem"];
    const validDifficulties = ["easy", "medium", "hard"];

    if (trimmedRouteName.length < 2) {
        return res.status(400).json({
            success: false,
            message: "Route name must be at least 2 characters"
        });
    }

    if (trimmedRouteDescription.length < 5) {
        return res.status(400).json({
            success: false,
            message: "Description must be at least 5 characters"
        });
    }

    if (Number.isNaN(routeDurationNumber) || routeDurationNumber <= 0) {
        return res.status(400).json({
            success: false,
            message: "Duration must be a positive number"
        });
    }

    if (!validRegions.includes(routeRegion)) {
        return res.status(400).json({
            success: false,
            message: "Invalid region"
        });
    }

    if (!validDifficulties.includes(routeDifficulty)) {
        return res.status(400).json({
            success: false,
            message: "Invalid difficulty"
        });
    }

    const newRoute = {
        route_name: trimmedRouteName,
        region: routeRegion,
        difficulty: routeDifficulty,
        duration_hours: routeDurationNumber,
        description: trimmedRouteDescription,
        created_by: 1,
        is_circular: selectedFeatures.includes("circular") ? 1 : 0,
        suitable_dogs: selectedFeatures.includes("dogs") ? 1 : 0,
        suitable_babies: selectedFeatures.includes("babies") ? 1 : 0,
        romantic: selectedFeatures.includes("romantic") ? 1 : 0,
        water_entry: selectedFeatures.includes("water") ? 1 : 0
    };

    sql.query("INSERT INTO routes SET ?", newRoute, (err, mysqlres) => {
        if (err) {
            console.log("Error creating route:", err);
            return res.status(500).json({
                success: false,
                message: "Error creating route"
            });
        }

        return res.json({
            success: true,
            message: "Route created successfully",
            routeId: mysqlres.insertId
        });
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Server listen
app.listen(port, () => {
    console.log(`Tripper server is running on http://localhost:${port}/`);
});
