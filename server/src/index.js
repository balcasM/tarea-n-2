const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4321'
}));

app.use(express.json());

app.get('/api/challenges', async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/submissions', async (req, res) => {
  const { challengeId, code } = req.body;
  try {
    const status = code.includes('return') ? 'Aceptado' : 'Error de compilación';
    const submission = await prisma.submission.create({
      data: {
        challengeId: parseInt(challengeId),
        code,
        status
      }
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});