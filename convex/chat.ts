import { action } from "./_generated/server";
import { v } from "convex/values";

export const getAIResponse = action({
  args: {
    history: v.array(
      v.object({ 
        role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")), 
        content: v.string() 
      })
    ),
  },
  handler: async (ctx, args) => {
    try {
      const targetWebsite = "https://taqtiq.tech"; 
      const scraperResponse = await fetch(`https://r.jina.ai/${targetWebsite}`);
      const websiteMarkdownContent = await scraperResponse.text();

      const systemPrompt = `
        You are an advanced, live support assistant. 
        Use the following retrieved live information from our website to answer the user's questions accurately.
        If the answer cannot be found in the context, politely direct them to use our "Send us a Message" form.

        --- START OF SITE LIVE CONTENT ---
        ${websiteMarkdownContent}
        --- END OF SITE LIVE CONTENT ---
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            ...args.history
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.choices || data.choices.length === 0) {
        throw new Error("Failed to compile AI response from Groq.");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("RAG Error:", error);
      return "I'm having trouble pulling live data from the website right now. Please try again shortly!";
    }
  },
});