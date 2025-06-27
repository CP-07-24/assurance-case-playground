import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Zap, Trash } from 'lucide-react';
import { useDiagramContext } from '../../context/DiagramContext';
import { ShapeOnCanvas } from '../../types/shapes';
import { gsnElements } from '../../data/shapeData';

// Define types for messages
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  generatedDiagram?: boolean;
}

interface AIChatInterfaceProps {
  onClose: () => void;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ onClose }) => {
  // Get diagram context to interact with diagram
  const { addShape, addConnection } = useDiagramContext();
  
  // State for messages
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hi there! I'm your AI diagram assistant. Tell me what kind of diagram you need, and I'll help you create it. For example, you could ask me to 'Create a safety case for autonomous vehicles' or 'Generate a software safety assurance diagram.'",
    sender: 'ai',
    timestamp: new Date(),
  }]);
  
  // State for current input
  const [inputValue, setInputValue] = useState('');
  
  // State for loading/generating
  const [isGenerating, setIsGenerating] = useState(false);

  // State for displaying success notification
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Ref for message container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hide success notification after delay
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  // Handle sending messages
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);
    
    // Process the user's request and generate diagram
    setTimeout(() => {
      processUserRequest(userMessage.content);
      setIsGenerating(false);
    }, 1500);
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Process user request and generate appropriate diagram
  const processUserRequest = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let responseContent = "";
    
    // Match user input to determine diagram type
    if (lowerInput.includes('autonomous') || lowerInput.includes('self-driving') || lowerInput.includes('vehicle')) {
      responseContent = "I'll create an autonomous vehicle safety assurance diagram for you.";
      generateAutonomousVehicleDiagram();
    } 
    else if (lowerInput.includes('hazard') || lowerInput.includes('risk')) {
      responseContent = "I'll generate a hazard analysis diagram structure for you.";
      generateHazardAnalysisDiagram();
    }
    else if (lowerInput.includes('software') || lowerInput.includes('code')) {
      responseContent = "Creating a software safety assurance diagram as requested.";
      generateSoftwareSafetyDiagram();
    }
    else if (lowerInput.includes('medical') || lowerInput.includes('device') || lowerInput.includes('healthcare')) {
      responseContent = "Generating a medical device safety case diagram structure.";
      generateMedicalDeviceDiagram();
    }
    else {
      // Default to basic safety case
      responseContent = "I'll create a basic safety case diagram structure for you.";
      generateBasicSafetyDiagram();
    }
    
    // Add AI response
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: responseContent,
      sender: 'ai',
      timestamp: new Date(),
      generatedDiagram: true
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setShowSuccess(true);
  };
  
  // Generate diagram functions for different scenarios
  
  const generateBasicSafetyDiagram = () => {
    const shapesData = [
      { idText: 'G1', value: 'System is acceptably safe', x: 400, y: 100, width: 200, height: 80 },
      { idText: 'G2', value: 'Hardware is safe', x: 200, y: 250, width: 180, height: 70 },
      { idText: 'G3', value: 'Software is safe', x: 450, y: 250, width: 180, height: 70 },
      { idText: 'G4', value: 'Operation is safe', x: 700, y: 250, width: 180, height: 70 },
      { idText: 'Sn1', value: 'Hardware test results', x: 200, y: 380, width: 180, height: 70, type: 'sacm' },
      { idText: 'Sn2', value: 'Software verification report', x: 450, y: 380, width: 180, height: 70, type: 'sacm' },
      { idText: 'Sn3', value: 'Operational procedures', x: 700, y: 380, width: 180, height: 70, type: 'sacm' },
    ];
    
    createDiagram(shapesData, [
      [0, 1], [0, 2], [0, 3], [1, 4], [2, 5], [3, 6]
    ]);
  };
  
  const generateAutonomousVehicleDiagram = () => {
    const shapesData = [
      { idText: 'G1', value: 'Autonomous vehicle is acceptably safe', x: 400, y: 100, width: 250, height: 80 },
      { idText: 'S1', value: 'Argument by operational scenarios', x: 400, y: 200, width: 240, height: 70, type: 'extension' },
      { idText: 'G2', value: 'Perception system is reliable', x: 150, y: 300, width: 200, height: 70 },
      { idText: 'G3', value: 'Decision making is safe', x: 400, y: 300, width: 200, height: 70 },
      { idText: 'G4', value: 'Vehicle control is reliable', x: 650, y: 300, width: 200, height: 70 },
      { idText: 'Sn1', value: 'Sensor fusion test results', x: 150, y: 400, width: 200, height: 70, type: 'sacm' },
      { idText: 'Sn2', value: 'Decision algorithm verification', x: 400, y: 400, width: 200, height: 70, type: 'sacm' },
      { idText: 'Sn3', value: 'Control system validation', x: 650, y: 400, width: 200, height: 70, type: 'sacm' },
    ];
    
    createDiagram(shapesData, [
      [0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 6], [4, 7]
    ]);
  };
  
  const generateHazardAnalysisDiagram = () => {
    const shapesData = [
      { idText: 'G1', value: 'All hazards are mitigated', x: 400, y: 100, width: 200, height: 80 },
      { idText: 'S1', value: 'Argument by hazard analysis', x: 400, y: 180, width: 200, height: 70, type: 'extension' },
      { idText: 'G2', value: 'Hazard 1 is mitigated', x: 250, y: 250, width: 180, height: 70 },
      { idText: 'G3', value: 'Hazard 2 is mitigated', x: 550, y: 250, width: 180, height: 70 },
      { idText: 'Sn1', value: 'Hazard 1 mitigation evidence', x: 250, y: 350, width: 180, height: 70, type: 'sacm' },
      { idText: 'Sn2', value: 'Hazard 2 mitigation evidence', x: 550, y: 350, width: 180, height: 70, type: 'sacm' },
    ];
    
    createDiagram(shapesData, [
      [0, 1], [1, 2], [1, 3], [2, 4], [3, 5]
    ]);
  };
  
  const generateSoftwareSafetyDiagram = () => {
    const shapesData = [
      { idText: 'G1', value: 'Software is acceptably safe', x: 400, y: 100, width: 200, height: 80 },
      { idText: 'S1', value: 'Argument by verification & validation', x: 400, y: 200, width: 240, height: 70, type: 'extension' },
      { idText: 'G2', value: 'Requirements are correct', x: 150, y: 300, width: 200, height: 70 },
      { idText: 'G3', value: 'Implementation is correct', x: 400, y: 300, width: 200, height: 70 },
      { idText: 'G4', value: 'Testing is comprehensive', x: 650, y: 300, width: 200, height: 70 },
      { idText: 'Sn1', value: 'Requirements review report', x: 150, y: 400, width: 200, height: 70, type: 'sacm' },
      { idText: 'Sn2', value: 'Static analysis results', x: 400, y: 400, width: 200, height: 70, type: 'sacm' },
      { idText: 'Sn3', value: 'Test coverage report', x: 650, y: 400, width: 200, height: 70, type: 'sacm' },
    ];
    
    createDiagram(shapesData, [
      [0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 6], [4, 7]
    ]);
  };
  
  const generateMedicalDeviceDiagram = () => {
    const shapesData = [
      { idText: 'G1', value: 'Medical device is safe for use', x: 400, y: 100, width: 220, height: 80 },
      { idText: 'S1', value: 'Argument by regulatory compliance', x: 400, y: 200, width: 240, height: 70, type: 'extension' },
      { idText: 'G2', value: 'Hardware meets requirements', x: 200, y: 300, width: 200, height: 70 },
      { idText: 'G3', value: 'Software meets requirements', x: 450, y: 300, width: 200, height: 70 },
      { idText: 'G4', value: 'User safe operation', x: 700, y: 300, width: 180, height: 70 },
      { idText: 'Sn1', value: 'Hardware certification', x: 200, y: 400, width: 180, height: 70, type: 'sacm' },
      { idText: 'Sn2', value: 'Software validation', x: 450, y: 400, width: 180, height: 70, type: 'sacm' },
      { idText: 'Sn3', value: 'Usability testing', x: 700, y: 400, width: 180, height: 70, type: 'sacm' },
    ];
    
    createDiagram(shapesData, [
      [0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [3, 6], [4, 7]
    ]);
  };
  
  // Helper function to create diagram from shapes data and connections
  const createDiagram = (
    shapesData: Array<{
      idText: string;
      value: string;
      x: number;
      y: number;
      width: number;
      height: number;
      type?: string;
    }>,
    connections: Array<[number, number]>
  ) => {
    // Create the shapes and store their IDs
    const shapeIds: string[] = [];
    
    shapesData.forEach((shapeData) => {
      const baseShape = shapeData.type === 'sacm' ? gsnElements[2] : 
                       shapeData.type === 'extension' ? gsnElements[1] : 
                       gsnElements[0]; // Use appropriate shape as base
      
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
      shapeIds.push(id);
      
      const newShape: ShapeOnCanvas = {
        ...baseShape,
        id,
        x: shapeData.x,
        y: shapeData.y,
        width: shapeData.width,
        height: shapeData.height,
        value: shapeData.value,
        idText: shapeData.idText,
        cornerRadius: shapeData.type === 'extension' ? 5 : 0
      };
      
      addShape(newShape);
    });
    
    // Add connections after a small delay to ensure shapes are added
    setTimeout(() => {
      connections.forEach(([fromIndex, toIndex], index) => {
        if (shapeIds[fromIndex] && shapeIds[toIndex]) {
          addConnection({
            id: `conn-${Date.now()}-${index}`,
            from: shapeIds[fromIndex],
            to: shapeIds[toIndex],
            points: []
          });
        }
      });
    }, 100);
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Hi there! I'm your AI diagram assistant. Tell me what kind of diagram you need, and I'll help you create it. For example, you could ask me to 'Create a safety case for autonomous vehicles' or 'Generate a software safety assurance diagram.'",
      sender: 'ai',
      timestamp: new Date(),
    }]);
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-50 rounded-full p-2 mr-3">
            <Sparkles size={20} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">AI Diagram Assistant</h3>
            <p className="text-sm text-gray-500">
              Describe the diagram you want to create
            </p>
          </div>
        </div>
        <button 
          className="text-gray-500 hover:text-gray-700 p-1"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Success notification */}
      {showSuccess && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-200 text-green-800 px-4 py-2 rounded-md flex items-center shadow-md z-50">
          <Zap size={16} className="mr-2" />
          <span>Diagram successfully generated!</span>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg ${
                  message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.generatedDiagram && (
                  <div className="mt-2 bg-blue-50 p-2 rounded text-sm text-blue-800 flex items-center">
                    <Zap size={14} className="mr-1" />
                    <span>Diagram generated and added to canvas</span>
                  </div>
                )}
                <div className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[85%]">
                <div className="flex items-center">
                  <div className="mr-2 text-sm text-gray-600">Generating diagram</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Bottom toolbar */}
      <div className="px-4 py-2 border-t border-gray-200 flex justify-end">
        <button 
          className="text-gray-500 hover:text-gray-700 p-1"
          onClick={clearChat}
          title="Clear chat"
        >
          <Trash size={16} />
        </button>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end">
          <div className="flex-grow relative">
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the diagram you want to create..."
              rows={2}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button
            className={`ml-2 p-2 rounded-full ${
              inputValue.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;