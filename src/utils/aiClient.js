import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export const generateTaskDescription = async (taskTitle) => {
  // Craft a precise prompt to get the desired JSON output
  const prompt = `
    You are a helpful assistant for software engineers. Your job is to generate a concise and helpful task description based only on a title.

    The user will provide a task title. You must respond ONLY with a JSON object that has a single key "description" and a string value.

    Title: "${taskTitle}"
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Good balance of cost and speed for an MVP
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }, 
    });

    // Parse the JSON response from the AI
    const aiResponse = JSON.parse(completion.choices[0].message.content);
    return aiResponse.description; 

  } catch (error) {
    console.error("AI API Error:", error);
    return `This task involves working on: ${taskTitle}. Details to be discussed.`;
  }
};