const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandlder = require('express-async-handler');
const bcrypt =  require('bcrypt');


// @desc Get all users
// @route Get /users
// @access Private

const getAllUsers = asyncHandlder(async (req, res) => {
    const users = await User.find().select('-password').lean() //the -password it wont return the password the lean return basic the data the needed

    if(!users?.length) {
        return res.status(400).json({message : 'No users found'});
    }
    res.json(users);
})  

// @desc Create new users
// @route POST /users
// @access Private

const createNewUser = asyncHandlder(async (req, res) => {
    const { username, password, roles } = req.body; //deconstruction the model
    
    // Confirm data
    if(!username || !password || !Array.isArray(roles) || !roles.length) { //if one of them fail or not fill up
        return res.status(400).json({message: 'All fields are required.'});
    }

    // Check for duplicate
    // const duplicate = await User.findOne({ username }).lean().exec(); //if you use async we need to use .exec()  //refactor to regex case sensitive
    const duplicate = await User.findOne({ "username": { $regex: username, $options: 'i' } }).lean().exec();
    if(duplicate) {
        return res.status(409).json({message : ' Duplicate username'}) //409 stands for conflict
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // the 10 is for the salt rounds
    const userObject = { username, "password" : hashedPwd, roles}

    // Create and store new user
    const user = await User.create(userObject);

    if(user) { //created
        res.status(201).json({message : `New user ${username} created`});
    } else {
        res.status(400).json({message : 'Invalid data received.'})
    }
})

// @desc Udate a user
// @route PATCH /users
// @access Private

const updateUser = asyncHandlder(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    //Confirm data
    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message : 'All fields are required.'});
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({message : 'User not found'});
    }

    //check for duplicate
    // const duplicate = await User.findOne({ username }).lean().exec() //refactor for case sensitive
    const duplicate = await User.findOne({ "username": { $regex: username, $options: 'i' } }).lean().exec();

    //Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message : 'Duplicate username'});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if(password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({message : `${updatedUser.username} updated`});
})

// @desc Delete a user
// @route DELETE /users
// @access Private

const deleteUser = asyncHandlder(async (req, res) => {
    const { id } = req.body;

    if(!id){
        return res.status(400).json({message: 'User ID Required'});
    }

    //check the if the user has a note it will stop to delete
    const note = await Note.findOne({user : id}).lean().exec();
    if(note){
        return res.status(400).json({message : ' User has assigned notes'});
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({message: 'User not found'});
    }
    // the user will be deleted but the records will be hold in the result
    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} deleted.`

    res.json(reply);


})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}