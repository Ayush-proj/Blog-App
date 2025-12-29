import express from "express"
import{
    submitContact,
    getAllMessages,
    markAsRead,
    deleteMessage
} from "../controllers/contactController.js";

import {protect} from "../middleware/auth.js"

const router= express.Router();

router.post("/",submitContact);
router.get("/",protect,getAllMessages);
router.put("/:id/read",protect,markAsRead);
router.delete("/:id",protect,deleteMessage);

export default router;
