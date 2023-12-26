// notes.js

import express from 'express';
import { body, validationResult } from 'express-validator';
import fetchuser from '../middleware/fetchuser.js';
import Note from '../models/Note.js';

const router = express.Router();

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag, deadline } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id,
            deadline
        });
        const savedNote = await note.save();

        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag, deadline } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }
        if (deadline) { newNote.deadline = deadline; }

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        // Allow deletion only if the user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Update Note to mark as complete using: PUT "/api/notes/:id/complete"
router.put('/:id/complete', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Note.findById(taskId);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        task.completed = true;
        await task.save();

        return res.json({ success: true, message: 'Task marked as complete' });
    } catch (error) {
        console.error('Error marking task as complete:', error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
