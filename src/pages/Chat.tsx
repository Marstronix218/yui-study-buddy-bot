
import React, { useState, useEffect, useRef } from "react";
import { Send, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Layout from "@/components/Layout";
import { characters } from "@/data/characters";
import { Message } from "@/types/message";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get selected character from localStorage
    const savedCharacterId = localStorage.getItem("selectedCharacter");
    if (savedCharacterId) {
      const character = characters.find(c => c.id === savedCharacterId);
      if (character) {
        setSelectedCharacter(character);
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: `こんにちは！${character.name}です。${character.catchphrase} 今日は何を勉強しましょうか？`,
          sender: "ai",
          timestamp: new Date(),
          characterId: character.id
        };
        setMessages([welcomeMessage]);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput("");

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `${input}についてですね。一緒に勉強していきましょう！`,
        sender: "ai",
        timestamp: new Date(),
        characterId: selectedCharacter.id
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleCharacterChange = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      setSelectedCharacter(character);
      localStorage.setItem("selectedCharacter", characterId);
      
      // Add character switch message
      const switchMessage: Message = {
        id: Date.now().toString(),
        content: `${character.name}に切り替わりました。${character.catchphrase}`,
        sender: "ai",
        timestamp: new Date(),
        characterId: character.id
      };
      setMessages(prev => [...prev, switchMessage]);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between py-3 px-4 border-b">
          <div className="flex items-center gap-2">
            <Avatar className={`h-8 w-8 ${selectedCharacter.color}`}>
              <AvatarFallback>{selectedCharacter.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedCharacter.name}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown size={16} />
                <span className="sr-only">キャラクター変更</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {characters.map(character => (
                <DropdownMenuItem 
                  key={character.id}
                  onClick={() => handleCharacterChange(character.id)}
                >
                  {character.name} ({character.personality})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <Avatar className={`h-8 w-8 mr-2 ${selectedCharacter.color}`}>
                  <AvatarFallback>{selectedCharacter.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-[75%] p-3 rounded-lg ${
                  message.sender === "user" 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
