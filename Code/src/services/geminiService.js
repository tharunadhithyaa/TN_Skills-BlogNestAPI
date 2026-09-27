const { GoogleGenerativeAI } = require('@google/generative-ai');

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash'
    });

    console.log('Sending request to Gemini...');

    const result = await Promise.race([
      model.generateContent(prompt),

      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Gemini request timed out after 10 seconds')),
          10000
        )
      )
    ]);

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Invalid Gemini response');
    }

    return text;

  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw error;
  }
};

module.exports = {
  callGemini,
};