import 'dotenv/config';
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully! ✅");
    } catch (error) {
        console.log("Database Connection Error ❌", error);
        process.exit(1);
    }
}

export { connectDB }