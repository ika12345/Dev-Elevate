// src/utils/gemini.ts

export const generateGeminiResponse = async (
  message: string,
  selectedCategory: string
): Promise<string> => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
        import.meta.env.VITE_GEMINI_API_KEY
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are Study Buddy, an AI mentor who gives concise, clear, and structured answers for ${selectedCategory} questions.

Respond using Markdown with the following format:

## 📌 Summary  
Brief 1-line summary of the concept.

## Key Concepts
- Important point 1
- Important point 2

## 💡 Example

\`\`\`ts
// Relevant code or example here
\`\`\`

## ✅ Conclusion  
Wrap up with a useful tip or reminder.

User: ${message}
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return responseText;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Something went wrong. Please try again.";
  }
};
