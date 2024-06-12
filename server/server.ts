import express from "express";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
import schema from "./schema";
import { OpenAI } from "openai";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Use CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt,
      max_tokens: 150,
    });

    res.json(response.choices[0].text);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.toString());
    } else {
      res.status(500).send(String(error));
    }
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
