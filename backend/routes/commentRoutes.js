import express from "express"
import {
    addComment,
    deleteComment,
    getAllComments,
    getCommentByPost
}from "../controllers/commentController.js";

import {protect} from "../middleware/auth.js"
const router=express.Router();

router.get("/post/:postId",getCommentByPost);
router.get("/",getAllComments);

router.post("/",protect,addComment);
router.delete("/:id",protect,deleteComment);

export default router;