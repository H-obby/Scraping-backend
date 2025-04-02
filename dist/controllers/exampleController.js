"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = exports.getItems = void 0;
const getItems = (req, res) => {
    // Example data
    res.status(200).json('I see trees of greeeeeeeeeeeeeen');
};
exports.getItems = getItems;
const createItem = (req, res) => {
    const newItem = req.body;
    // Here you would typically save to a database
    res.status(201).json({
        message: 'Item created successfully',
        item: newItem
    });
};
exports.createItem = createItem;
