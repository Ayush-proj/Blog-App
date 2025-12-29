import express from "express"
import Contact from "../models/Contact.js";

export const submitContact =async(req,res)=>{
try {
    const {name,email,subject,message}=req.body;

    const contact = await Contact.create({
        name,
        email,
        subject,
        message
    });

    res.status(201).json({
        success:true,
        message:"Message sent successfully well get back to you soon. ",
        data:contact
    })
} catch (error) {
    res.status(401).json({
        success:false,
        message:error.message
    })
    
}
};

export const getAllMessages=async(req,res)=>{
    try {
        const messages =await Contact.find().sort({createdAt:-1});
        res.status(200).json({
            success:true,
            count:getAllMessages.length,
            data:messages
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// only admin can markAsRead 

export const markAsRead =async(req,res)=>{
    try {
        const {id} =req.params;
        
        const message =await Contact.findByIdAndUpdate(
            id,
            {status:"read"},
            {new:true}
        );
    if(!message){
        return res.status(404).json({
            success:false,
            message:"message not found"
        });
    }

    res.status(200).json({
        success:true,
        data:message
    });


    } catch (error) {
        res.status(500).json({
            success:true,
            message:error.message
        })
        
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Contact.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};