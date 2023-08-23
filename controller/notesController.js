const Note = require('../models/Note');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');


// @desc Get all notes
// @route Get /notes
// @access Private

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()

    // If no notes 
    if(!notes?.length) {
        return res.status(400).json({message : 'No notes found'});
    }
    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)

})  

// @desc Create new users
// @route POST /users
// @access Private

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // Confirm data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    // Create and store the new user 
    const note = await Note.create({user, title, text});
    res.json(note);
    if (note) { // Created 
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// @desc Udate a user
// @route PATCH /users
// @access Private

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    //Confirm data
    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message : 'All fields are required.'});
    }

    const note = await Note.findById(id).exec()

    if(!note) {
        return res.status(400).json({message : 'Note not found'});
    }

    //check for duplicate
    // const duplicate = await User.findOne({ username }).lean().exec() //refactor for case sensitive
    const duplicate = await Note.findOne({ "title": { $regex: title, $options: 'i' } }).lean().exec();

    //Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message : 'Duplicate note title'});
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    if(password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedNote = await note.save()

    res.json({message : `${updatedNote.title} updated`});
})

// @desc Delete a user
// @route DELETE /users
// @access Private

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if(!id){
        return res.status(400).json({message: 'Note ID Required'});
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // the user will be deleted but the records will be hold in the result
    const result = await note.deleteOne();

    const reply = `Note ${result.title} with ID ${result._id} deleted.`

    res.json(reply);


})

module.exports = {
    getAllNotes,
     createNewNote,
     updateNote,
     deleteNote
}