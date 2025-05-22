
import React from "react";
import { useNavigate } from "react-router-dom";
import { characters } from "@/data/characters";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();

  const handleSelectCharacter = (characterId: string) => {
    // In a real app, we would store the selection in state or localStorage
    localStorage.setItem("selectedCharacter", characterId);
    navigate("/chat");
  };

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-center mb-8">YUI - あなたの学習パートナー</h1>
        <p className="text-center mb-8 text-gray-600">学習をサポートするAIキャラクターを選んでください</p>
        
        <div className="grid gap-6">
          {characters.map((character) => (
            <Card key={character.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className={`h-16 w-16 ${character.color}`}>
                    <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{character.name}</h3>
                    <p className="text-sm text-gray-500">{character.personality}</p>
                  </div>
                </div>
                <p className="italic text-gray-700">"{character.catchphrase}"</p>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-4">
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectCharacter(character.id)}
                >
                  選択する
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
