import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const message: Message = {
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addMessage('user', inputValue);
    setInputValue('');
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "I understand. How can I help you further?",
        "That's interesting! Tell me more.",
        "I'm here to assist you with anything you need.",
        "Let me think about that...",
        "Great question! Here's what I think...",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage('assistant', randomResponse);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        addMessage('user', 'Voice message received');
      }, 3000);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-neon-cyan/30 to-neon-blue/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-neon-purple/30 to-neon-pink/30 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">ARIA</h1>
                <p className="text-sm text-muted-foreground">Personal AI Assistant</p>
              </div>
            </div>
            <Badge variant="outline" className="glow-purple">
              {isListening ? 'Listening...' : 'Ready'}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Chat Interface */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass glow-cyan h-[70vh] flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-border/20">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Conversation</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatRef}
              className="flex-1 p-6 overflow-y-auto space-y-6"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan animate-pulse-glow">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold gradient-text mb-2">Hello! I'm ARIA</h3>
                    <p className="text-muted-foreground">Your personal AI assistant. How can I help you today?</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 animate-fade-in ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary glow-purple' 
                          : 'bg-gradient-to-r from-neon-cyan to-neon-blue glow-cyan'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-primary-foreground" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'glass border border-border/20'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-start space-x-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center glow-cyan">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="glass border border-border/20 p-4 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border/20">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full bg-background/50 border border-border/20 rounded-full px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full glow-cyan"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  size="lg"
                  variant={isListening ? "default" : "outline"}
                  onClick={toggleListening}
                  className={`rounded-full w-12 h-12 ${
                    isListening ? "glow-pink animate-pulse-glow" : "glow-purple"
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};