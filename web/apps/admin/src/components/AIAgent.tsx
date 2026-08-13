'use client';

import { useState, useEffect, useRef } from 'react';
import { DEALER_CONFIG } from '../config/dealer';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  actionType?: string;
}

export default function AIAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! 👋 I'm your DAKIRO Assistant. I can help you with tasks like:\n• Add customers or devices\n• Search inventory\n• Generate receipts\n• View sales data\n• Create sales records\n\nWhat would you like to do?`,
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseCommand = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Customer commands
    if (lowerInput.includes('add customer') || lowerInput.includes('new customer')) {
      return {
        type: 'ADD_CUSTOMER',
        description: 'Add Customer',
      };
    }

    // Device commands
    if (lowerInput.includes('add device') || lowerInput.includes('add phone')) {
      return {
        type: 'ADD_DEVICE',
        description: 'Add Device',
      };
    }

    // Search commands
    if (lowerInput.includes('search') || lowerInput.includes('find')) {
      return {
        type: 'SEARCH',
        description: 'Search Database',
      };
    }

    // Sale commands
    if (lowerInput.includes('create sale') || lowerInput.includes('new sale')) {
      return {
        type: 'CREATE_SALE',
        description: 'Create Sale',
      };
    }

    // Receipt commands
    if (lowerInput.includes('receipt') || lowerInput.includes('print')) {
      return {
        type: 'RECEIPT',
        description: 'Generate Receipt',
      };
    }

    // Payment commands
    if (lowerInput.includes('payment') || lowerInput.includes('pay')) {
      return {
        type: 'LOG_PAYMENT',
        description: 'Log Payment',
      };
    }

    // Help commands
    if (lowerInput.includes('help') || lowerInput.includes('what can you')) {
      return {
        type: 'HELP',
        description: 'Show Help',
      };
    }

    // Info commands
    if (lowerInput.includes('info') || lowerInput.includes('about')) {
      return {
        type: 'INFO',
        description: 'Show Info',
      };
    }

    return {
      type: 'QUESTION',
      description: 'Answer Question',
    };
  };

  const getAgentResponse = (commandType: string): string => {
    const responses: Record<string, string> = {
      ADD_CUSTOMER: `I can help you add a customer to DAKIRO's system. Please provide the following details:\n• Customer Name\n• Phone Number\n• National ID\n• Location\n\nJust type the details and I'll add them to the system.`,

      ADD_DEVICE: `To add a phone device to inventory, I'll need:\n• Phone Model (e.g., Samsung A05)\n• IMEI Number (15 digits)\n• Serial Number\n• Condition (new/refurbished/used)\n\nProvide these details and I'll add it to DAKIRO's inventory.`,

      CREATE_SALE: `I can create a new sale record. Please provide:\n• Customer Name (or search from existing)\n• Phone Model\n• Sales Agent Name\n• Down Payment Amount\n• Installment Duration (months)\n\nI'll record this as a new sale.`,

      LOG_PAYMENT: `To log a payment, I need:\n• Sale Reference/Customer Name\n• Payment Amount\n• Payment Method (M-Pesa, Bank, Cash)\n• Transaction Reference (if applicable)\n\nI'll record the payment immediately.`,

      RECEIPT: `I can generate a receipt for DAKIRO GENERAL ELECTRONICS. Tell me:\n• Customer Name\n• Items Purchased\n• Amount\n• Agent Name\n\nI'll create a professional receipt in DAKIRO's format.`,

      SEARCH: `I can search DAKIRO's database for:\n• Customers (by name or phone)\n• Devices (by IMEI or model)\n• Sales records\n• Agents\n\nWhat would you like to search for?`,

      HELP: `I'm DAKIRO's AI Assistant. Here's what I can do:\n\n📱 **Inventory**: Add devices, search IMEI numbers\n👥 **Customers**: Register new customers, view profiles\n💳 **Sales**: Create sales records, track deals\n💰 **Payments**: Log payments, track installments\n📄 **Receipts**: Generate professional receipts\n📊 **Reports**: View sales data and statistics\n\nJust ask me to do any of these tasks!`,

      INFO: `Welcome to DAKIRO GENERAL ELECTRONICS!\n\n${DEALER_CONFIG.name}\nP.O BOX ${DEALER_CONFIG.poBox}, ${DEALER_CONFIG.location}\nTel: ${DEALER_CONFIG.phone}\n${DEALER_CONFIG.address}\n\nWe deal in: ${DEALER_CONFIG.dealersIn.join(', ')}\n\nI'm here to help manage your business efficiently!`,

      QUESTION: `I appreciate your question! While I'm primarily designed to help with business tasks, I'm always learning. For complex questions about DAKIRO's operations, feel free to ask the team or explore the relevant section in the app.\n\nIs there a specific task I can help you with?`,
    };

    return responses[commandType] || responses.QUESTION;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      const command = parseCommand(inputValue);
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(command.type),
        sender: 'agent',
        timestamp: new Date(),
        actionType: command.type,
      };

      setMessages((prev) => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  const quickCommands = [
    { label: '➕ Add Customer', cmd: 'add customer' },
    { label: '📱 Add Device', cmd: 'add device' },
    { label: '💳 Create Sale', cmd: 'create sale' },
    { label: '💰 Log Payment', cmd: 'log payment' },
    { label: '📄 Receipt', cmd: 'generate receipt' },
    { label: '🔍 Search', cmd: 'search inventory' },
    { label: '❓ Help', cmd: 'help' },
    { label: 'ℹ️ Info', cmd: 'about dakiro' },
  ];

  return (
    <>
      {/* Agent Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 flex items-center justify-center"
          title="Open AI Assistant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </button>
      )}

      {/* Agent Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col h-[600px] border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">🤖 DAKIRO Assistant</h3>
              <p className="text-xs opacity-90">AI-powered task helper</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded p-1 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap text-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commands */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2 max-h-32 overflow-y-auto">
              <p className="text-xs text-gray-600 font-medium">Quick Commands:</p>
              <div className="grid grid-cols-2 gap-1">
                {quickCommands.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => {
                      setInputValue(cmd.cmd);
                      setTimeout(() => {
                        const event = new KeyboardEvent('keydown', { key: 'Enter' });
                        document.dispatchEvent(event);
                      }, 100);
                    }}
                    className="text-xs bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary px-2 py-1 rounded transition border border-gray-200"
                  >
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me to help..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputValue.trim()}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
