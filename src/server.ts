import { app } from "./app";
import dotenv from "dotenv";
import { connect } from "./infra/database/mongoose";

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
