import express, { Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import OpenAI from 'openai';
import { z } from 'zod';

// Load environment variables from .env.local
config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

// Chat endpoint handler
const chatHandler: RequestHandler = async (req, res, next) => {
  try {
    // Parse and validate request body
    const body = req.body;
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
      model: "gpt-4.1-nano",
      messageCount: messages.length,
      firstMessage: messages[0],
      lastMessage: messages[messages.length - 1]
    });

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
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
    res.json({
      reply: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in chat API:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      res.status(400).json({
        error: 'Invalid request format',
        details: error.errors
      });
      return;
    }

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', {
        message: error.message,
        type: error.type,
        code: error.code
      });
      res.status(500).json({
        error: 'OpenAI API error',
        details: error.message
      });
      return;
    }

    // Handle other errors
    console.error('Unexpected error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Register the chat endpoint
app.post('/api/chat', chatHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 