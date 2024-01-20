import express from "express";
import { usersLogin, getUsersById, createUsers, getAllUsers, activateUserById, deactivateUserById, updateUsers, duplicateEmail, deleteusersById } from "../controller/users.controller.js";

const router = express.Router()


router.post("/login",usersLogin);
router.get("/:id", getUsersById);
router.post("/",createUsers);
router.get("/", getAllUsers);
router.put("/activate/:id", activateUserById);
router.put("/deactivate/:id", deactivateUserById);
router.put("/updateUsers", updateUsers);
router.get("/duplicate/:email", duplicateEmail);
router.delete("/delete/:id", deleteusersById);

export default router;