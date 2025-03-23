import mongoose from "mongoose";

const connect = (): void => {
  mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log("error connecting", err);
    });
};

export default connect;
