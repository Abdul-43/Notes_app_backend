
import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Note = mongoose.model('notes', NotesSchema);

export default Note;
