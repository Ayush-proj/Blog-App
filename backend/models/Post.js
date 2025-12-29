import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"]
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            minlength: [10, "Content must be at least 10 characters"]
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,  // ← Changed: Now references User
            ref: "User",                            // ← Links to User model
            required: [true, "Author is required"]
        },
        category: {                                 // ← NEW: Category field
            type: String,
            required: [true, "Category is required"],
            enum: ["Technology", "React", "CSS", "JavaScript", "Node.js", "MongoDB", "Other"],
            default: "Other"
        },
        tags: {
            type: [String],
            default: []
        },
        published: {
            type: Boolean,
            default: false
        },
        views: {                                    // ← NEW: Track views
            type: Number,
            default: 0
        },
        image: {                                    // ← NEW: Post image
            type: String,
            default: ""
        },
        likes:{
            type:[mongoose.Schema.Types.ObjectId],
            ref:"User",
            default:[]
        },

        likesCount:{
            type:Number,
            default:0
        }
    },
    {
        timestamps: true
    }
);

// Index for search functionality
postSchema.index({ title: "text", content: "text" });

export default mongoose.model("Post", postSchema);
