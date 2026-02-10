import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

prisma
    .$connect()
    .then(() => {
        console.log("Connected to PostgreSQL database");
    })
    .catch((err: any) => {
        console.error("PostgreSQL Connection Error", err);
    });

export default prisma;
