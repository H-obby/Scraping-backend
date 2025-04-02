"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const exampleRoutes_1 = __importDefault(require("./routes/exampleRoutes"));
const featsRoutes_1 = __importDefault(require("./routes/featsRoutes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200', // Your frontend origin
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api', exampleRoutes_1.default);
app.use('/api', featsRoutes_1.default);
// Basic route
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server is running');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
