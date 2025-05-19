
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const apiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, responseFormat } = await req.json();

    const response = await fetch(`${apiEndpoint}?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
          responseMimeType: responseFormat === 'json' ? 'application/json' : 'text/plain',
        }
      }),
    });

    const data = await response.json();
    
    // Check if we have valid response data
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API");
    }

    const generatedContent = data.candidates[0].content.parts[0].text;
    
    // If JSON was requested, try to parse it
    let parsedResponse = generatedContent;
    if (responseFormat === 'json') {
      try {
        // The response might already be a JSON object if responseMimeType worked correctly
        if (typeof generatedContent === 'string') {
          parsedResponse = JSON.parse(generatedContent);
        }
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        // Return the raw text if JSON parsing fails
      }
    }

    return new Response(JSON.stringify({ 
      content: parsedResponse,
      rawContent: generatedContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-generate function:', error);
    return new Response(JSON.stringify({ 
      error: 'Error generating content',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
