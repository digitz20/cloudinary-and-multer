
const userModel = require('../model/user')
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt')
const fs = require('fs')



exports.register = async (req, res) => {
    try {
        const {fullName, email, password} =req.body
        
        const result = await cloudinary.uploader.upload(req.file.path)
        fs.unlinkSync(req.file.path)
        
        const emailExists = await userModel.findOne({email: email.toLowerCase()})
        
        if(emailExists){
            await cloudinary.uploader.destroy(result.public_id)
            return res.status(400).json({message:`user with email: ${email} already exists`})
        }

        const salt  = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new userModel({
            fullName,
            email,
            password: hashedPassword,
            profilePic: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }

        })
        
        await user.save()

        res.status(200).json({message: 'user created successfully', data: user})
    } catch (error) {
        res.status(500).json({message: 'internal server error' + error.message})
    }
}



exports.getAllUser = async (req, res) => {
    try {
        const getAll = await userModel.find()

        res.status(200).json({message: 'find below all users', data: getAll})


    } catch (error) {
        res.status(500).json({message: 'internal server error' + error.message})
    }
}


exports.getOneUser = async (req, res) => { 
    try {
        const {id} = req.params

        const user = await userModel.findById(id)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        res.status(200).json({message: ' find below the user with the id', data: user})


    } catch (error) {

        res.status(500).json({message: 'internal server error' + error.message})
    }
}




exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params

        const {fullName, email, } = req.body

        const user = await userModel.findById(id)

        if(!user) {
            return res.status(404).json({message: 'user not found'})
           
        } else {
            if(req.file) {

                await cloudinary.uploader.destroy(user.profilePic.publicId)
            }
        }

        
        
        const result = await cloudinary.uploader.upload(req.file.path)
        fs.unlinkSync(req.file.path)


        const data = {
            fullName,
            email,
            profilePic: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }

        }

        const newUpdate = await userModel.findByIdAndUpdate(id, data, {new: true})

        res.status(200).json({message: 'user has been updated successfully', data: newUpdate})

    } catch (error) {
        res.status(500).json({message: 'internal server error' + error.message})
    }
}




exports.deleteUser = async (req, res) => {
    try {
        const { id} = req.params

        const user = await userModel.findById(id)

        if(!user) { 
            return res.status(404).json({message: ' user not found'})
        }

        const deletedUser = await userModel.findByIdAndDelete(id)

        
        if(deletedUser) {

            await cloudinary.uploader.destroy(user.profilePic.publicId)
            
        }

        res.status(200).json({message: 'user has been deleted successfully', data: deletedUser})

    } catch (error) {
        res.status(500).json({message: 'internal server error' + error.message})
    }
}