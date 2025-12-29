import Post from "../models/Post.js";

/**
 * CONTROLLER = The brain of your backend
 * Each function handles ONE specific action
 */

// 📝 CREATE a new blog post
export const createPost=async(req,res) =>{
    try {
        const {title,content,category,tags,published,image}=req.body;

        const newPost=await Post.create({
            title,
            content,
            author:req.user.id,
            category,
            tags,
            published,
            image
        })
        await newPost.populate("author","name email avatar")



        res.status(201).json({
            success:true,
            message:"post created successfully",
            data:newPost
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }

}

export const getAllPosts =async(req,res)=>{
    try {
        const { category, search, published } = req.query;
        
        let query={}
        
        if(category){
            query.category=category;
        }
        if(published!==undefined){
            query.published=published ==="true"
        }
        if (search){
            query.$or=[
                 { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ]
        }
     const posts =await Post.find(query)
        .populate("author","name email avatar")
        .sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count:posts.length,
            data:posts
        });
    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
    })
}};

export const getPostById =async(req,res)=>{
    try {
        const {id} =req.params;
        const post =await Post.findById(id).populate("author","name email avatar bio");

        if(!post){
            return res.status(404).json({
                success:false,
                message:"post not found"

            });
        }
        post.views+=1;
        await post.save();

        res.status(200).json({
            success:true,
            data:post
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const updatePost=async(req,res)=>{
    try {
        const {id}=req.params;
        const updates=req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updates,
            {new:true,runValidators:true}
        ).populate("author","name email avatar");

        if(!updatedPost){
            return res.status(404).json({
                success:false,
                message:"post not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });


    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


export const deletePost=async(req,res)=>{
    try {
        const {id}=req.params;
        
        console.log('🗑️ Delete request for post:', id);
        console.log('👤 User ID from token:', req.user?.id);
        console.log('🛡️ User role:', req.user?.role);
        
        const post =await Post.findById(id);
        
        if (!post) {
            console.log('❌ Post not found');
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        console.log('📝 Post author:', post.author);
        console.log('🔍 Comparing:', post.author.toString(), 'with', req.user.id);

        // Allow deletion if user is the author OR if user is admin
        const isAuthor = post.author.toString() === req.user.id.toString();
        const isAdmin = req.user.role === 'admin';

        if(!isAuthor && !isAdmin){
            console.log('❌ Permission denied - not the author or admin');
            return res.status(403).json({
                success:false,
                message: "You can only delete your own posts"
            })
        }
        
        await Post.findByIdAndDelete(id);

        console.log('✅ Post deleted successfully');
        res.status(200).json({
            success:true,
            message: "Post deleted successfully"
        })
    } catch (error) {
        console.error('❌ Delete error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getPostsByCategory=async(req,res)=>{
    try {
        const {category}=req.params;
        const posts = await Post.find({ category, published: true })
            .populate("author", "name avatar")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        
    }
}

export const likePost=async(req,res)=>{
    try {

        const {id}=req.params;
        const userId=req.user.id;

        const post=await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        
    if (post.likes.includes(userId)){
            return res.status(400).json({
                success:false,
                message:"you already liked post"
            });
        }
        post.likes.push(userId);
        post.likesCount=post.likes.length;
        await post.save();   
        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            data: {
                likesCount: post.likesCount
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message
    });
    
    }
}

// unlike posts 
export const unlikePost=async (req,res)=>{
    try {
        const {id}=req.params;
        const userId =req.user.id;

        const post =await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        if(!post.likes.includes(userId)){
            return res.status(400).json({
                success:false,
                message:"you haven't liked this post"
            });

        }

        post.likes =post.likes.filter(like=>like.toString()!==userId);
        post.likes.count=post.likes.length;
        await post.save();

        res.status(200).json({
             success: true,
            message: "Post unliked successfully",
            data: {
                likesCount: post.likesCount
            }
        });

    } catch (error) {
         res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




// export const createPost = async (req, res) => {
//     try {
//         // 1. Get data from request body (what user sent)
//         const { title, content, author, tags, published } = req.body;

//         // 2. Create new post in database
//         const newPost = await Post.create({
//             title,
//             content,
//             author,
//             tags,
//             published
//         });

//         // 3. Send success response
//         res.status(201).json({
//             success: true,
//             message: "Post created successfully",
//             data: newPost
//         });

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// 📖 GET all blog posts
// export const getAllPosts = async (req, res) => {
//     try {
//         // Find all posts, sorted by newest first
//         const posts = await Post.find().sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             count: posts.length,
//             data: posts
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // 🔍 GET a single post by ID
// export const getPostById = async (req, res) => {
//     try {
//         // Get ID from URL parameter (e.g., /api/posts/12345)
//         const { id } = req.params;

//         const post = await Post.findById(id);

//         if (!post) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: post
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // ✏️ UPDATE a post
// export const updatePost = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;

//         // Find post and update it
//         const updatedPost = await Post.findByIdAndUpdate(
//             id,
//             updates,
//             { new: true, runValidators: true } // Return updated doc & validate
//         );

//         if (!updatedPost) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Post updated successfully",
//             data: updatedPost
//         });

//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // 🗑️ DELETE a post
// export const deletePost = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedPost = await Post.findByIdAndDelete(id);

//         if (!deletedPost) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Post deleted successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
