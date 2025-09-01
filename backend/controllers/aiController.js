import { generateTaskDescription } from '../utils/aiClient.js';

export const suggestDescription = async (req, res) => {
  try {
    const { title } = req.body; // Get title from request body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const description = await generateTaskDescription(title);
    res.json({ description }); // Send back the AI-generated description

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate suggestion' });
  }
};