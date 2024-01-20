import mongoose from "mongoose";
import Users from "../model/users.model.js";
import multer from 'multer';
const ObjectId = mongoose.Types.ObjectId;

const Storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, res, cb) => {
        cb(null, Date.now() + "_" + (res.originalname).trim());
    }
});
const upload = multer({
    storage: Storage,
}).single('image');



// Internal Login
export const usersLogin = async (req, res) => {
    const { email, password } = req.body;
    const users = await Users.findOne({ email });

    if (users && (await users.comparePassword(password))) {
        return res.json({
            _id: users._id,
            name: users.name,
            email: users.email,
            mobile: users.mobile,
            role: users.role,
            imageURL: users.imageURL
        });
    } else {
        res.send(
            {
                error: true,
                message: "User doesn't exist"
            }
        );
    }
}


// Create Users
export const createUsers = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err)
        } else {
            try {
                const { name, email, password, role, mobile } = req.body;

                // Check if the user with the same mobile already exists
                const existingMobile = await Users.findOne({ mobile: req.body.mobile });
                if (existingMobile) {
                    return res.send({ "uploaded": false, "message": "This mobile number already exists." });
                }

                // Check if the email already exists in the database
                const existingEmail = await Users.findOne({ email: req.body.email });
                if (existingEmail) {
                    return res.send({ "uploaded": false, message: 'Oops! This email address is already in use with another account.' });
                }

                const users = Users.create({
                    name: name,
                    email: email,
                    password: password,
                    role: role,
                    mobile: mobile,
                    image: {
                        contentType: 'image',
                        data: req.file.filename
                    },
                    imageURL: 'uploads/' + req.file.filename
                });
                if (users) {
                    return res.status(200).json(
                        {
                            error: false,
                            status: true,
                            message: "User created successfully",
                            data: users
                        }
                    );
                }
                
                console.log(users);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ "uploaded": false, message: "Server Error" });
            }
        }
    });
};


// Get Users by ID
export const getUsersById = async (req, res) => {
    const users = await Users.find({ _id: new ObjectId(req.params.id), isDelete: false });
    res.send(users)
};


// Get all Users (excluding Admin) by role
export const getAllUsers = async (req, res) => {
    let query = { 'role': { $ne: "admin" }, isDelete: false }
    if (req.query.utype) {
        query = { 'role': req.query.utype, isDelete: false }
    }
    const users = await Users.find(query)
    .sort({ createdAt: -1 }).exec();
    res.send(users)
};


// Activate a user
export const activateUserById = async (req, res) => {
    try {
        //   const userId = req.params.id;
        const user = await Users.findByIdAndUpdate({ _id: new ObjectId(req.params.id) }, { isActive: true }, { new: true });
        res.send(user);
    } catch (error) {
        console.error(error);
        res.send({ error: 'Internal Server Error' });
    }
};

// Deactivate a user
export const deactivateUserById = async (req, res) => {
    try {
        //   const userId = req.params.id;
        const user = await Users.findByIdAndUpdate({ _id: new ObjectId(req.params.id) }, { isActive: false }, { new: true });
        res.send(user);
    } catch (error) {
        console.error(error);
        res.send({ error: 'Internal Server Error' });
    }
};


// Update Users by ID
export const updateUsers = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.send({
                error: true,
                message: "File upload failed"
            });
        }

        // Update the users profile based on whether a file is uploaded or not
        const updateData = {
            $set: {
                "name": req.body.name,
                "email": req.body.email,
                "mobile": req.body.mobile,
                "password": req.body.password,
                "role": req.body.role
            }
        };

        if (req.file) {
            updateData.$set.image = {
                contentType: 'image',
                data: req.file.filename
            };
            updateData.$set.imageURL = 'uploads/' + req.file.filename;
        }

        try {
            const resp = await Users.updateOne({ _id: req.body._id }, updateData);

            if (resp) {
                res.status(200).json({ message: "update success" });
            } else {
                res.status(500).json({ message: "update failed" });
            }
        } catch (error) {
            console.error(error);
            return res.send({
                error: true,
                message: "Internal server error"
            });
        }
    });
};


// Check email duplicacy
export const duplicateEmail = async (req, res) => {
    const existingEmail = await Users.findOne({ email: req.params.email });
    if (existingEmail) {
        return res.send({ "uploaded": false, message: 'Oops! This email address is already in use with another account.' });
    } else {
        return res.send({ message: 'Unique email address' });
    }
}


// Delete users by ID
export const deleteusersById = async (req, res) => {
    const users = await Users.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { "isActive": false, "isDelete": true } });
    if (users) {
        res.send(
            {
                error: false,
                message: "deleted successfully"
            }
        );
    } else {
        res.send(
            {
                error: true,
                message: "deletion failed"
            }
        );
    }
}
