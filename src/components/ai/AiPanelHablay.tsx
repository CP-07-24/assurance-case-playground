import React, { useState, useRef } from 'react';
import { Sparkles, Send, X, Workflow, ListTree, Wand2, User, Bot } from 'lucide-react';
import { useDiagramContext } from '../../context/DiagramContext';
import { gsnElements } from '../../data/shapeData';

// Simple message type
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'action';
}

const AiPanel: React.FC = () => {
  const { shapes, connections, addShape, addConnection } = useDiagramContext();

  // Simple state for chat interface
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hi! I can help you create diagrams. Try asking for a safety case, hazard analysis, or software safety diagram.",
    sender: 'ai',
    timestamp: new Date(),
    type: 'text'
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Start chat button handler
  const handleStartChat = () => {
    try {
      setShowChat(true);
    } catch (error) {
      console.error("Error showing chat:", error);
      alert("Error showing chat interface. See console for details.");
    }
  };

  // Send message handler
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, userMessage]);

      const userInput = inputValue;
      setInputValue('');
      setIsGenerating(true);

      // Process after a short delay
      setTimeout(() => {
        processUserMessage(userInput);
        setIsGenerating(false);

        // Scroll to bottom
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsGenerating(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your request.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  };

  // Process user message and generate appropriate diagram
  const processUserMessage = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let aiResponse = "";

    // Determine which diagram to generate
    if (lowerInput.includes('autonomous') || lowerInput.includes('vehicle')) {
      aiResponse = "I'll create an autonomous vehicle safety diagram for you.";
      generateAutonomousVehicleDiagram();
    }
    else if (lowerInput.includes('hazard') || lowerInput.includes('risk')) {
      aiResponse = "Creating a hazard analysis diagram for you.";
      generateHazardDiagram();
    }
    else if (lowerInput.includes('software')) {
      aiResponse = "Generating a software safety assurance diagram now.";
      generateSoftwareDiagram();
    }
    else {
      aiResponse = "I'll create a basic safety case diagram for you.";
      generateBasicDiagram();
    }

    // Add AI response
    const botMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
  };

  // Diagram generation functions
  const generateBasicDiagram = () => {
    const id1 = Date.now().toString() + "1";
    const id2 = Date.now().toString() + "2";
    const id3 = Date.now().toString() + "3";

    // Add main goal
    addShape({
      ...gsnElements[0],
      id: id1,
      x: 400,
      y: 100,
      width: 200,
      height: 80,
      value: "System is acceptably safe",
      idText: "G1"
    });

    // Add subgoals
    addShape({
      ...gsnElements[0],
      id: id2,
      x: 300,
      y: 250,
      width: 180,
      height: 70,
      value: "Hardware is safe",
      idText: "G2"
    });

    addShape({
      ...gsnElements[0],
      id: id3,
      x: 500,
      y: 250,
      width: 180,
      height: 70,
      value: "Software is safe",
      idText: "G3"
    });

    // Add connections
    setTimeout(() => {
      addConnection({
        id: `conn-${Date.now()}-1`,
        from: id1,
        to: id2,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-2`,
        from: id1,
        to: id3,
        points: []
      });
    }, 100);
  };

  const generateAutonomousVehicleDiagram = () => {
    const id1 = Date.now().toString() + "1";
    const id2 = Date.now().toString() + "2";
    const id3 = Date.now().toString() + "3";
    const id4 = Date.now().toString() + "4";

    // Add main goal
    addShape({
      ...gsnElements[0],
      id: id1,
      x: 400,
      y: 100,
      width: 240,
      height: 80,
      value: "Autonomous vehicle is acceptably safe",
      idText: "G1"
    });

    // Add strategy
    addShape({
      ...gsnElements[1], // Using extension shape
      id: id2,
      x: 400,
      y: 200,
      width: 220,
      height: 70,
      value: "Argument by operational scenarios",
      idText: "S1",
      cornerRadius: 5
    });

    // Add subgoals
    addShape({
      ...gsnElements[0],
      id: id3,
      x: 250,
      y: 300,
      width: 180,
      height: 70,
      value: "Perception system is reliable",
      idText: "G2"
    });

    addShape({
      ...gsnElements[0],
      id: id4,
      x: 550,
      y: 300,
      width: 180,
      height: 70,
      value: "Decision making is safe",
      idText: "G3"
    });

    // Add connections
    setTimeout(() => {
      addConnection({
        id: `conn-${Date.now()}-1`,
        from: id1,
        to: id2,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-2`,
        from: id2,
        to: id3,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-3`,
        from: id2,
        to: id4,
        points: []
      });
    }, 100);
  };

  const generateHazardDiagram = () => {
    const id1 = Date.now().toString() + "1";
    const id2 = Date.now().toString() + "2";
    const id3 = Date.now().toString() + "3";
    const id4 = Date.now().toString() + "4";

    // Add main goal
    addShape({
      ...gsnElements[0],
      id: id1,
      x: 400,
      y: 100,
      width: 200,
      height: 80,
      value: "All hazards are mitigated",
      idText: "G1"
    });

    // Add strategy
    addShape({
      ...gsnElements[1],
      id: id2,
      x: 400,
      y: 200,
      width: 200,
      height: 70,
      value: "Argument by hazard analysis",
      idText: "S1",
      cornerRadius: 5
    });

    // Add subgoals
    addShape({
      ...gsnElements[0],
      id: id3,
      x: 250,
      y: 300,
      width: 180,
      height: 70,
      value: "Hazard 1 is mitigated",
      idText: "G2"
    });

    addShape({
      ...gsnElements[0],
      id: id4,
      x: 550,
      y: 300,
      width: 180,
      height: 70,
      value: "Hazard 2 is mitigated",
      idText: "G3"
    });

    // Add connections
    setTimeout(() => {
      addConnection({
        id: `conn-${Date.now()}-1`,
        from: id1,
        to: id2,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-2`,
        from: id2,
        to: id3,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-3`,
        from: id2,
        to: id4,
        points: []
      });
    }, 100);
  };

  const generateSoftwareDiagram = () => {
    const id1 = Date.now().toString() + "1";
    const id2 = Date.now().toString() + "2";
    const id3 = Date.now().toString() + "3";
    const id4 = Date.now().toString() + "4";

    // Add main goal
    addShape({
      ...gsnElements[0],
      id: id1,
      x: 400,
      y: 100,
      width: 200,
      height: 80,
      value: "Software is acceptably safe",
      idText: "G1"
    });

    // Add strategy
    addShape({
      ...gsnElements[1],
      id: id2,
      x: 400,
      y: 200,
      width: 240,
      height: 70,
      value: "Argument by verification & validation",
      idText: "S1",
      cornerRadius: 5
    });

    // Add subgoals
    addShape({
      ...gsnElements[0],
      id: id3,
      x: 250,
      y: 300,
      width: 180,
      height: 70,
      value: "Requirements are correct",
      idText: "G2"
    });

    addShape({
      ...gsnElements[0],
      id: id4,
      x: 550,
      y: 300,
      width: 180,
      height: 70,
      value: "Implementation is correct",
      idText: "G3"
    });

    // Add connections
    setTimeout(() => {
      addConnection({
        id: `conn-${Date.now()}-1`,
        from: id1,
        to: id2,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-2`,
        from: id2,
        to: id3,
        points: []
      });

      addConnection({
        id: `conn-${Date.now()}-3`,
        from: id2,
        to: id4,
        points: []
      });
    }, 100);
  };

  // Close chat button handler
  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Return the appropriate UI based on chat state
  if (!showChat) {
    // Initial panel with start button
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <div className="bg-blue-50 rounded-full p-3 mb-4">
          <Sparkles size={24} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">AI Diagram Assistant</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Use AI to generate diagrams, analyze existing diagrams, or get suggestions for improvements.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          onClick={handleStartChat}
        >
          Start using AI
        </button>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Chat interface
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-50 rounded-full p-2 mr-2">
            <Sparkles size={18} className="text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">AI Diagram Assistant</h3>
            <p className="text-xs text-gray-500">
              {shapes.length} elements • {connections.length} connections
            </p>
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700 p-1"
          onClick={handleCloseChat}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'user' ? (
                    <User size={14} className="opacity-70" />
                  ) : (
                    <Bot size={14} className="opacity-70" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex space-x-1 items-center">
                  <div>Generating...</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2 mb-2 overflow-x-auto">
          <button
            onClick={() => setInputValue('Generate a simple flowchart')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full"
          >
            <Workflow size={14} /> Flowchart
          </button>
          <button
            onClick={() => setInputValue('Analyze my diagram')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full"
          >
            <ListTree size={14} /> Analyze
          </button>
          <button
            onClick={() => setInputValue('Optimize the layout')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border rounded-full"
          >
            <Wand2 size={14} /> Optimize
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your diagram..."
            className="w-full pr-10 pl-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={isGenerating}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${inputValue.trim() && !isGenerating
              ? 'text-blue-500 hover:bg-blue-50'
              : 'text-gray-400'
              }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiPanel;