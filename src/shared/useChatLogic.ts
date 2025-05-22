
import { useState, useEffect } from 'react';
import { fetchChatResponse } from './api';
import { Message } from '../types/message';
import { Character } from './characterData';

export const useChatLogic = (initialCharacter: Character) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(initialCharacter);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 初期メッセージを表示
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `こんにちは！${selectedCharacter.name}です。${selectedCharacter.catchphrase} 今日は何を勉強しましょうか？`,
      sender: "ai",
      timestamp: new Date(),
      characterId: selectedCharacter.id
    };
    setMessages([welcomeMessage]);
  }, [selectedCharacter.id]);

  const sendMessage = async (content: string) => {
    if (content.trim() === '') return;
    
    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // APIリクエストをシミュレート
      const response = await fetchChatResponse(content, selectedCharacter.id);
      
      // AIレスポンスを追加
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: new Date(),
        characterId: selectedCharacter.id
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('メッセージの送信に失敗しました:', error);
      // エラーメッセージを表示
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "すみません、エラーが発生しました。もう一度お試しください。",
        sender: "ai",
        timestamp: new Date(),
        characterId: selectedCharacter.id
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const changeCharacter = (character: Character) => {
    setSelectedCharacter(character);
    
    // キャラクター切り替えメッセージ
    const switchMessage: Message = {
      id: Date.now().toString(),
      content: `${character.name}に切り替わりました。${character.catchphrase}`,
      sender: "ai",
      timestamp: new Date(),
      characterId: character.id
    };
    
    setMessages(prev => [...prev, switchMessage]);
  };

  return {
    messages,
    input,
    setInput,
    sendMessage,
    selectedCharacter,
    changeCharacter,
    isLoading
  };
};
