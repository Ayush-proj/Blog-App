import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment=async(req,res)=>{
    try {
        const{postId ,content}=req.body;

        const post=await Post.findById(postId);

       if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

    const comment =await Comment.create({
        content,
        author:req.user.id,
        post:postId
    })

    await comment.populate("author","name avatar");
    res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: comment
        });
    } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getCommentByPost =async(req,res)=>{
    try {
        const {postId} =req.params

        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comments=await Comment.find({post:postId})
        .populate("author","name avatar")
        .sort({created:-1});

          res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        
    }
}

export const deleteComment=async (req,res)=>{
    try {
        const {id} =req.params;
        const comment =await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }
   if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getAllComments =async (req,res) =>{

    try {
        const comments=await Comment.find()
        .populate("author","name avatar")
        .populate("post" ,"title")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });

    } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message
        });
    }

}