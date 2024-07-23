import express from "express";
import connectDb from "./connectDb.js";
import userRoutes from "./user/user.routes.js";
import resetPasswordRoutes from "./forget-password/reset.password.routes.js";
import cors from "cors";

const app = express();

// to make app understand json
app.use(express.json());

// cors
app.use(cors());

// connect db
connectDb();

// register routes
app.use(userRoutes);
app.use(resetPasswordRoutes);

// port and server
// const PORT = process.env.API_PORT;
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
