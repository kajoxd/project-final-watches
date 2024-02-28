import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

class Backend {
    constructor() {
        this.app = express();
        this.db = null;

        this.handleRootRequest = this.handleRootRequest.bind(this);
        this.handleFetchModels = this.handleFetchModels.bind(this);
        this.handleCreateModel = this.handleCreateModel.bind(this);
        this.handleDeleteModel = this.handleDeleteModel.bind(this);
        this.handleUpdateModel = this.handleUpdateModel.bind(this);
    }

    startServer(port) {
        // Get the current file path
        const __filename = fileURLToPath(import.meta.url);
        // Get the current directory path
        const __dirname = dirname(__filename);

        // Configure multer for file uploads
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "uploads/");
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            },
        });

        const upload = multer({ storage }); // Specify the storage configuration for uploaded files

        this.app.use(express.json());
        this.app.use(cors());
        this.app.use("/uploads", express.static("uploads"));

        // Connect to the database
        try {
            this.db = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "watches",
            });
            this.db.connect();
        } catch (error) {
            console.log(error);
        }

        this.app.get("/", this.handleRootRequest);
        this.app.get("/models", this.handleFetchModels);
        this.app.post("/models", upload.single("face"), this.handleCreateModel);
        this.app.delete("/models/:id", this.handleDeleteModel);
        this.app.put("/models/:id", upload.single("face"), this.handleUpdateModel);

        this.app.listen(port, () => {
            console.log(`Connected to backend on port ${port}`);
        });
    }

    handleRootRequest(req, res) {
        res.json("Hello, this is the backend");
    }

    handleFetchModels(req, res) {
        const q = "SELECT * FROM models";
        this.db.query(q, (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    }

    handleCreateModel(req, res) {
        const q = "INSERT INTO models (`Title`, `desc`, `price`, `face`) VALUES (?, ?, ?, ?)";
        const avatar = req.file ? req.file.originalname : null;
        const values = [
            req.body.Title,
            req.body.desc,
            req.body.price,
            avatar
        ];

        this.db.query(q, values, (err, data) => {
            if (err) return res.json(err);
            return res.json("Watch has been created");
        });
    }

    handleDeleteModel(req, res) {
        const modelId = req.params.id;
        const q = "DELETE FROM models WHERE id = ?";

        this.db.query(q, [modelId], (err, data) => {
            if (err) return res.json(err);
            return res.json("Watch has been deleted");
        });
    }

    handleUpdateModel(req, res) {
        const modelId = req.params.id;
        const q =
            "UPDATE models SET `Title` = ?, `desc` = ?, `price` = ?, `face` = ? WHERE id = ?";

        const avatar = req.file ? req.file.originalname : null;
        const values = [
            req.body.Title,
            req.body.desc,
            req.body.price,
            avatar,
            modelId
        ];

        this.db.query(q, values, (err, data) => {
            if (err) return res.json(err);
            return res.json("Watch has been updated");
        });
    }
}

// Instantiate the backend and start the server
const backend = new Backend();
backend.startServer(8800);
