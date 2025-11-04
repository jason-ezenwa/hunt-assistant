// Server-side auth configuration with MongoDB
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const mongoUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/hunt-assistant";
const client = new MongoClient(mongoUri);
const db = client.db("hunt-assistant");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID || '',
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  //   },
  // },
  trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
  user: {
    modelName: "users",
  },
  account: {
    modelName: "accounts",
  },
  session: {
    modelName: "sessions",
  },
  token: {
    modelName: "tokens",
  },
  verification: {
    modelName: "verifications",
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
