import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/verify-signature', async (req, res) => {
  const { message, signature } = req.body;
  if (typeof message !== 'string' || typeof signature !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    // Recover signer address
    const signer = ethers.verifyMessage(message, signature);
    // Validate signature (if recover succeeds, it's valid)
    res.json({
      isValid: true,
      signer,
      originalMessage: message
    });
  } catch (err) {
    res.json({
      isValid: false,
      signer: null,
      originalMessage: message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
