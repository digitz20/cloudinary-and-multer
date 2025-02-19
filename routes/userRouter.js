const { register , getAllUser, getOneUser, updateUser, deleteUser } = require('../controller/userController')

const router = require('express').Router()

const upload = require('../utils/multer')

router.post('/register', upload.single('profilePic'), register)

router.get('/getalluser',  getAllUser)

router.get('/getoneuser/:id',  getOneUser)

router.put('/updateuser/:id', upload.single('profilePic'), updateUser)

router.delete('/deleteuser/:id', upload.single('profilePic'), deleteUser)




module.exports = router