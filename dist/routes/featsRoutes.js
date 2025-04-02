"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const featsController_1 = require("../controllers/featsController");
const router = express_1.default.Router();
router.get('/scrap-feats', featsController_1.scrapFeats);
exports.default = router;
