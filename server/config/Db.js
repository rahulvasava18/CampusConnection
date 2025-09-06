import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect( "mongodb://127.0.0.1:27017/campusConnection ", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            });
            
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error){
        consol.log(`Error: ${error.message}`);
    }
}

export default connectDB;