import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Canvas } from '@react-three/fiber';
import { AIAssistant3D } from './AIAssistant3D';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const AIAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive"
        });
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    addMessage(command, true);
    
    let response = "I understand your request, but I have limited capabilities in this demo environment.";
    
    const lowerCommand = command.toLowerCase();
    
    // Process different types of commands
    if (lowerCommand.includes('play') && lowerCommand.includes('spotify')) {
      response = "I'd love to play music on Spotify for you! 🎵 In a real implementation, I would connect to the Spotify API to play your requested song.";
    } else if (lowerCommand.includes('open') && (lowerCommand.includes('documents') || lowerCommand.includes('folder'))) {
      response = "Opening your documents folder! 📁 In a full implementation, I would access your local file system to open the requested folder.";
    } else if (lowerCommand.includes('search') && lowerCommand.includes('google')) {
      response = "Searching Google for you! 🔍 I would normally open a new browser tab with your search query.";
      // Actually open Google search
      const searchTerm = command.replace(/search.*?google.*?for/i, '').trim();
      if (searchTerm) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
      }
    } else if (lowerCommand.includes('shut down') || lowerCommand.includes('shutdown')) {
      response = "I cannot shut down your system for security reasons, but I understand you want to power off your device! 💻";
    } else if (lowerCommand.includes('time') || lowerCommand.includes('what time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()}! ⏰`;
    } else if (lowerCommand.includes('weather')) {
      response = "I'd love to check the weather for you! ☀️ In a full implementation, I would connect to a weather API to get current conditions.";
    } else if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      response = "Hello there! 👋 I'm your AI assistant. How can I help you today?";
    } else {
      response = "I hear you! While I'm still learning, I can help with basic commands like playing music, opening folders, searching Google, and checking the time. What would you like me to do? ✨";
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addMessage(response, false);
    speak(response);
    setIsProcessing(false);
  };

  const handleSendText = () => {
    if (inputText.trim()) {
      handleCommand(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendText();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-cyan/10" />
      
      {/* Main Container */}
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="relative z-20 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold gradient-text mb-2">
              AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent companion
            </p>
          </motion.div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* 3D Assistant - Centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 animate-float">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <AIAssistant3D isProcessing={isProcessing} isListening={isListening} />
              </Canvas>
            </div>
          </div>

          {/* Chat Interface - Right Side */}
          <div className="absolute top-4 right-4 w-96 h-[calc(100vh-12rem)] flex flex-col z-10">
            <Card className="glass border-neon-cyan/30 p-4 flex-1 flex flex-col max-h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Chat</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-neon-pink animate-pulse' : isProcessing ? 'bg-neon-cyan animate-pulse' : 'bg-muted'}`} />
                  <span className="text-xs text-muted-foreground">
                    {isListening ? 'Listening' : isProcessing ? 'Processing' : 'Ready'}
                  </span>
                </div>
              </div>
              
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isUser
                            ? 'bg-gradient-primary text-primary-foreground shadow-glow-cyan'
                            : 'glass border-neon-purple/30 text-foreground'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start"
                  >
                    <div className="glass border-neon-purple/30 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce delay-75" />
                          <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce delay-150" />
                        </div>
                        <span className="text-xs text-muted-foreground">Processing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your command..."
                  className="glass border-neon-cyan/30 bg-card/50 text-foreground placeholder:text-muted-foreground flex-1"
                />
                <Button
                  onClick={handleSendText}
                  variant="outline"
                  size="icon"
                  className="glass border-neon-cyan/30 hover:bg-neon-cyan/20 glow-cyan"
                  disabled={!inputText.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Welcome Message - Left Side */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 max-w-md z-10"
            >
              <Card className="glass border-neon-purple/30 p-6">
                <h2 className="text-2xl font-bold gradient-text mb-4">
                  Welcome!
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  I'm your personal AI assistant. I can help you with various tasks using voice or text commands.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full" />
                    <span className="text-neon-cyan">"Play my favorite song on Spotify"</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-neon-purple rounded-full" />
                    <span className="text-neon-purple">"Search for pizza places on Google"</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-neon-pink rounded-full" />
                    <span className="text-neon-pink">"What time is it?"</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Bottom Controls */}
        <footer className="relative z-20 p-6">
          <div className="flex items-center justify-center space-x-6">
            {/* Voice Control Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={isListening ? stopListening : startListening}
                variant="outline"
                size="lg"
                className={`glass border-neon-pink/50 hover:bg-neon-pink/20 w-16 h-16 rounded-full transition-all duration-300 ${
                  isListening ? 'glow-pink animate-pulse-glow' : 'glow-pink'
                }`}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </motion.div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 glass border-neon-cyan/30 px-4 py-2 rounded-full"
              >
                <Volume2 className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs text-foreground font-medium">Audio Ready</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 glass border-neon-purple/30 px-4 py-2 rounded-full"
              >
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  isListening ? 'bg-neon-pink animate-pulse' : 
                  isProcessing ? 'bg-neon-cyan animate-pulse' : 
                  'bg-muted'
                }`} />
                <span className="text-xs text-foreground font-medium">
                  {isListening ? 'Listening' : isProcessing ? 'Processing' : 'Ready'}
                </span>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};