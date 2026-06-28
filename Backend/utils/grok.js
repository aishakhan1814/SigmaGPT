import "dotenv/config";

const getGrokAPIResponse = async (message, history = []) => {
    // `history` already includes the latest user message (pushed by the
    // caller before this function runs), so we just prepend the system
    // prompt and forward the whole conversation for context.
    const conversation = history.length > 0
        ? history.map(m => ({ role: m.role, content: m.content }))
        : [{ role: "user", content: message }];

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",   // Good fast model on Groq
            messages: [
                { 
                    role: "system", 
                    content: "You are Grok, a helpful and truthful AI." 
                },
                ...conversation
            ],
            temperature: 0.7,
            max_tokens: 2048
        })
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        
        if (!response.ok) {
            const error = await response.text();
            console.error("Groq API Error:", error);
            return "Sorry, I'm having trouble responding right now.";
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response.";
        
    } catch (err) {
        console.error("Error:", err);
        return "Connection error. Please check console.";
    }
};

export default getGrokAPIResponse;