import mongoose from "mongoose";

const commentSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            required:[true, "Comment content is required"],
            trim:true,
            minLength:[1, "Comment cannot be empty"],
            maxlength: [500, "Comment cannot exceed 500 characters"]

        },

        author:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:[true,"Auther is required"]
        },

        post:{
            type:mongoose.Schema.ObjectId,
            ref:"Post",
            required:[true,"post is required"]
        },
    
    },
    {
        timestamps:true
    }
);

export default mongoose.model("Comment",commentSchema);