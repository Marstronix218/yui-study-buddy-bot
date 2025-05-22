
import React, { useEffect, useRef } from "react";
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
import { characters } from "@/shared/characterData";
import { useChatLogic } from "@/shared/useChatLogic";

const Chat = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 保存されたキャラクターを取得
  const savedCharacterId = localStorage.getItem("selectedCharacter") || "haku";
  const initialCharacter = characters.find(c => c.id === savedCharacterId) || characters[0];
  
  const { 
    messages, 
    input, 
    setInput, 
    sendMessage, 
    selectedCharacter, 
    changeCharacter, 
    isLoading 
  } = useChatLogic(initialCharacter);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    sendMessage(input);
  };

  const handleCharacterChange = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      localStorage.setItem("selectedCharacter", characterId);
      changeCharacter(character);
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
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
