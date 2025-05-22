import { characters } from './characterData';

// API関連の関数を抽象化
export const fetchChatResponse = async (message: string, characterId: string): Promise<string> => {
  try {
    const character = characters.find(c => c.id === characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    console.log('Sending request to /api/chat with:', {
      message,
      character: {
        name: character.name,
        prompt: character.prompt
      }
    });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        character: {
          name: character.name,
          prompt: character.prompt
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response:', data);
    return data.reply;
  } catch (error) {
    console.error('Error in fetchChatResponse:', error);
    throw error;
  }
};
