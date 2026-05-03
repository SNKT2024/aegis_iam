import "dotenv/config";
import app from "./app";
import prisma from "./config/db";
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected succesfully using Prisma");

    app.listen(PORT, () => {
      console.log(`Aegis IAM running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server: ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
