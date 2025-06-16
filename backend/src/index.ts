import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { recoverMessageAddress } from "viem";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.post("/verify-signature", async (req: any, res: any) => {
  const { message, signature } = req.body as {
    message: string;
    signature: `0x${string}`;
  };

  if (!message || !signature) {
    return res
      .status(400)
      .json({ error: "Message and signature are required" });
  }

  try {
    const signer = await recoverMessageAddress({
      message,
      signature,
    });

    return res.json({
      isValid: true,
      signer,
      originalMessage: message,
    });
  } catch (error) {
    return res.status(400).json({
      isValid: false,
      error: "Invalid signature",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
