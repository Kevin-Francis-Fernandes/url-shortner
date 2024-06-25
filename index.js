import express from "express";
import urlRoute from "./routes/url.js";
import connectToMongoDB from "./connect.js";
import { URL } from "./models/url.js";

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/url", urlRoute);

app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
    console.log(shortId)
    // Logging to verify the shortId value
    console.log(`Updating visited history for shortId: ${shortId}`);
    console.log(Date.now())
   
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
          $push: {
            visitedHistory: {
              timestamp: Date.now(),
            },
          },
        },
        { new: true }
      );
try{
    if (entry) {
      console.log('Update successful:', entry);
    } else {
      console.log('No entry found with shortId:', shortId);
    }
  } catch (error) {
    console.error('Error updating visited history:', error);
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
