import OpenAI from 'openai';
import { z } from 'zod';

// Define message role type
type MessageRole = 'system' | 'user' | 'assistant';
type ChatMessage = { role: MessageRole; content: string };

// Input validation schema
const chatRequestSchema = z.object({
  message: z.string().min(1),
  character: z.object({
    name: z.string().min(1),
    prompt: z.string().min(1)
  }),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant'] as const),
    content: z.string()
  })).optional()
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    console.log('Received request body:', body);
    
    const validatedData = chatRequestSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Construct the messages array
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are ${validatedData.character.name}. ${validatedData.character.prompt}\n\nAlways respond in character, maintaining a natural conversation flow. Never break character or acknowledge that you are an AI.`
      }
    ];

    // Add conversation history if available
    if (validatedData.history && validatedData.history.length > 0) {
      messages.push(...validatedData.history.map(msg => ({
        role: msg.role,
        content: msg.content
      })));
    }

    // Add the current user message
    messages.push({
      role: "user",
      content: validatedData.message
    });

    console.log('Sending to OpenAI:', {
      model: "gpt-3.5-turbo",
      messageCount: messages.length,
      firstMessage: messages[0],
      lastMessage: messages[messages.length - 1]
    });

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    });

    console.log('Received from OpenAI:', {
      content: completion.choices[0].message.content,
      finishReason: completion.choices[0].finish_reason
    });

    // Return the assistant's response
    return new Response(
      JSON.stringify({
        reply: completion.choices[0].message.content
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );
  } catch (error) {
    console.error('Error in chat API:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return new Response(
        JSON.stringify({
          error: 'Invalid request format',
          details: error.errors
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', {
        message: error.message,
        type: error.type,
        code: error.code
      });
      return new Response(
        JSON.stringify({
          error: 'OpenAI API error',
          details: error.message
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Handle other errors
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}