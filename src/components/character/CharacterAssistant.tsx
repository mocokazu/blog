'use client';

import { useState, useEffect } from 'react';
import { Character } from '@/types/character';
import { CharacterService } from '@/lib/database/characters';
import Live2DViewer from './Live2DViewer';
import VRMViewer from './VRMViewer';
import { MessageCircle, Settings, Minimize2, Maximize2 } from 'lucide-react';

interface CharacterAssistantProps {
  initialCharacterId?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
}

export default function CharacterAssistant({
  initialCharacterId,
  position = 'bottom-right',
  size = 'medium',
}: CharacterAssistantProps) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'character';
    message: string;
    timestamp: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sizes = {
    small: { width: 200, height: 250 },
    medium: { width: 300, height: 400 },
    large: { width: 400, height: 500 },
  };

  const positions = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
  };

  useEffect(() => {
    loadCharacter();
  }, [initialCharacterId]);

  const loadCharacter = async () => {
    try {
      setIsLoading(true);
      let loadedCharacter;

      if (initialCharacterId) {
        loadedCharacter = await CharacterService.getCharacterById(initialCharacterId);
      } else {
        loadedCharacter = await CharacterService.getDefaultCharacter();
      }

      setCharacter(loadedCharacter);
    } catch (error) {
      console.error('Failed to load character:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharacterInteraction = async (type: string, area?: string) => {
    if (!character) return;

    try {
      // インタラクションを記録
      await CharacterService.recordInteraction({
        character_id: character.id,
        interaction_type: type as any,
        trigger_area: area,
      });

      // キャラクターの応答を取得
      const response = await CharacterService.getCharacterResponse(
        character.id,
        area || type
      );

      if (response) {
        setChatHistory(prev => [...prev, {
          type: 'character',
          message: response.response,
          timestamp: new Date(),
        }]);
        
        if (!showChat) {
          setShowChat(true);
        }
      }
    } catch (error) {
      console.error('Failed to handle character interaction:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !character) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');

    // ユーザーメッセージを追加
    setChatHistory(prev => [...prev, {
      type: 'user',
      message: userMessage,
      timestamp: new Date(),
    }]);

    try {
      // キャラクターの応答を取得
      const response = await CharacterService.getCharacterResponse(
        character.id,
        userMessage
      );

      if (response) {
        setTimeout(() => {
          setChatHistory(prev => [...prev, {
            type: 'character',
            message: response.response,
            timestamp: new Date(),
          }]);
        }, 1000); // 少し遅延させて自然な会話感を演出
      }
    } catch (error) {
      console.error('Failed to get character response:', error);
    }
  };

  if (!isVisible || isLoading) {
    return null;
  }

  return (
    <div className={`${positions[position]} z-50`}>
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              {character?.name || 'アシスタント'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* キャラクター表示エリア */}
            <div className="relative">
              {character?.type === 'live2d' && character.live2d_model ? (
                <Live2DViewer
                  model={character.live2d_model}
                  width={sizes[size].width}
                  height={sizes[size].height}
                  onInteraction={handleCharacterInteraction}
                />
              ) : character?.type === 'vrm' && character.vrm_model ? (
                <VRMViewer
                  model={character.vrm_model}
                  width={sizes[size].width}
                  height={sizes[size].height}
                  onInteraction={handleCharacterInteraction}
                />
              ) : (
                <div 
                  className="flex items-center justify-center bg-gray-100 cursor-pointer"
                  style={{ width: sizes[size].width, height: sizes[size].height }}
                  onClick={() => handleCharacterInteraction('click')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <p className="text-sm text-gray-600">{character?.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* チャットエリア */}
            {showChat && (
              <div className="border-t bg-gray-50">
                <div className="h-32 overflow-y-auto p-2 space-y-2">
                  {chatHistory.slice(-5).map((chat, index) => (
                    <div
                      key={index}
                      className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-2 py-1 rounded text-xs ${
                          chat.type === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-800 border'
                        }`}
                      >
                        {chat.message}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="メッセージを入力..."
                      className="flex-1 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim()}
                      className="px-2 py-1 bg-primary-500 text-white text-xs rounded disabled:opacity-50 hover:bg-primary-600 transition-colors"
                    >
                      送信
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
