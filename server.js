import path from 'node:path'; // Public folder directory

import express from 'express';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load .env locally.
if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

const app = expres();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Rate limiter
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too many message sent. Please try again later.'
    }
});

// Contact endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {

    try {
        const { name, email, message } = req.body;

        // Basic validation
        if(!name || !email || !message){
            return res.status(400).json({
                error: 'Please fill in all fields.'
            });
        }

        if(!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD){
            throw new Error('Email credentials are missing.');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            replyTo: email,
            to: process.env.EMAIL_ADDRESS,
            subject: `Portfolio Contact From ${name}`,
            text: message
        });

        return res.status(200).json({
            success: true,
            message: 'Email sent Successfully!'
        });

    } catch (error) {
        
        console.error('Contact form error:', error);

        return res.status(500).json({
            error: 'Unable to send your message. Please try again later.'
        });
    }
});

// Exporting Express app for Vercel
export default app;