import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Mjk4ZjdmNDVmNjIyYWNhNTkwNDQ1OSIsImlhdCI6MTc2NDM4NDA5MSwiZXhwIjoxNzY0OTg4ODkxfQ.QEDQ_bT7g-eDAGLaA1UD3krJjQyrKA5JdBKT1w0tw48

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false // Don't return password by default
        },
        bio: {
            type: String,
            default: "",
            maxlength: [500, "Bio cannot exceed 500 characters"]
        },
        avatar: {
            type: String,
            default: "/images/default-avatar.png"
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
