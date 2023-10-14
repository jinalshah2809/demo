"use strict";
// // src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3001;
app.get('/users', (req, res) => {
    // Read the JSON file
    const filePath = path_1.default.join(__dirname, 'data.json');
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            //500 Internal Server Error" is a common HTTP status code
            return res.status(500).json({ message: 'Error reading data file' });
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData.users);
    });
});
// src/app.ts
const body_parser_1 = __importDefault(require("body-parser"));
// Middleware for parsing JSON requests
app.use(body_parser_1.default.json());
app.post('/addUser', (req, res) => {
    // Read existing data from the JSON file
    const filePath = path_1.default.join(__dirname, 'data.json');
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        }
        //The JSON.parse() method is a built-in JavaScript function used to convert a JSON-formatted string into a JavaScript object. It takes the JSON string as its argument.
        const jsonData = JSON.parse(data);
        // Generate a new user ID (you might use a more sophisticated method)
        const newUserId = jsonData.users.length + 1;
        // Create a new user object from the POST request data
        const newUser = {
            id: newUserId,
            name: req.body.name,
            email: req.body.email,
        };
        // Add the new user to the existing data
        jsonData.users.push(newUser);
        // Write the updated data back to the JSON file
        fs_1.default.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing data file' });
            }
            res.status(201).json(newUser);
        });
    });
});
app.put('/updateUser/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updatedData = req.body;
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const filePath = path_1.default.join(__dirname, 'data.json');
    // Read the existing data from the JSON file
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading data file' });
        }
        const jsonData = JSON.parse(data);
        // Find the user with the given ID
        const user = jsonData.users.find((user) => user.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update the user's data
        Object.assign(user, updatedData);
        // Write the updated data back to the JSON file
        fs_1.default.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ message: 'Error writing data file' });
            }
            res.json(user);
        });
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
