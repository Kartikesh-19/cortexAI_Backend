
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const connection = await mongoose.connect(
//       process.env.MONGO_URI,
//       {
//         serverSelectionTimeoutMS: 10000,
//       }
//     );

//     console.log(
//       `MongoDB connected: ${connection.connection.host}`
//     );

//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     throw error;
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  const uri = process.env.MONGO_URI?.trim();

  if (!uri) {
    throw new Error("MONGO_URI is missing from the chat service .env");
  }

  if (
    !uri.startsWith("mongodb://") &&
    !uri.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      "MONGO_URI must start with mongodb:// or mongodb+srv://"
    );
  }

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log(
      `Chat database connected: ${connection.connection.name}`
    );

    return connection;
  } catch (error) {
    console.error("Chat database connection failed:", error.message);

    // Stop startup instead of accepting requests without a database.
    throw error;
  }
};

export default connectDB;