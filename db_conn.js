import mongoose from 'mongoose';

const connectDb = async () => {
  const URL = "mongodb+srv://rajeshkumarbehera039:rajesh%401234@cluster0.awaeitb.mongodb.net/TerraCotta";
  try {
    await mongoose.connect(URL);
    console.log('MongoDb is connected');
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
