'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! 👋 Welcome to Lipa Mdogo. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'Help with inventory',
    'Agent management',
    'Phone pricing',
    'How to allocate',
  ];

  const botResponses: Record<string, string> = {
    'help with inventory': `📱 **Phone Inventory Help:**
You can manage your phone inventory in the Phone Inventory section:
1. View all phone models with pricing
2. Click "View" to see individual units with IMEI details
3. Search by IMEI or Serial number
4. Filter by status (In Stock, Allocated, Sold)
5. Allocate phones to agents directly

Need anything specific?`,

    'agent management': `👥 **Agent Management:**
In Agent Allocation Manager, you can:
1. View all sales agents by location
2. See their performance (Allocated, Sold, Unsold)
3. Monitor conversion rates and revenue
4. Allocate phones to agents
5. Track individual phones per agent

What would you like to know more about?`,

    'phone pricing': `💰 **Phone Pricing:**
Each phone model has:
- Down Payment (deposit required)
- Daily Installment (recurring charge)
- Estimated Total Price range

You can view detailed pricing by clicking "View" on any phone model in inventory.

Would you like to know about a specific model?`,

    'how to allocate': `📤 **How to Allocate Phones:**
1. Go to Phone Inventory → Phone Models tab
2. Click "View" on a phone model
3. Find an "In Stock" phone unit
4. Click the "Allocate" button
5. Select a sales agent
6. Confirm allocation

The phone will now show as "Allocated" with the agent's name.

Any other questions?`,
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase();
      let botResponse = '';

      // Check for matching keywords
      if (lowerInput.includes('inventory')) {
        botResponse = botResponses['help with inventory'];
      } else if (lowerInput.includes('agent')) {
        botResponse = botResponses['agent management'];
      } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
        botResponse = botResponses['phone pricing'];
      } else if (lowerInput.includes('allocate')) {
        botResponse = botResponses['how to allocate'];
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = 'Hello! 👋 I\'m here to help you with Lipa Mdogo. You can ask me about inventory, agents, pricing, or how to allocate phones.';
      } else if (lowerInput.includes('dashboard')) {
        botResponse = 'The Dashboard gives you a quick overview of your business:\n- Total Devices\n- Customers\n- Active Sales\n- Payments\n\nYou can also quickly add devices, customers, create sales, and log payments from here.';
      } else if (lowerInput.includes('thank')) {
        botResponse = 'You\'re welcome! 😊 Is there anything else I can help you with?';
      } else {
        botResponse = 'I understand you\'re asking about: "' + inputValue + '"\n\nHere are some topics I can help with:\n- Help with inventory\n- Agent management\n- Phone pricing\n- How to allocate\n\nFeel free to ask!';
      }

      const bot: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, bot]);
      setIsLoading(false);
    }, 500);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: reply,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      setTimeout(() => {
        const lowerReply = reply.toLowerCase();
        let botResponse = botResponses[lowerReply] || 'How can I help you with that?';

        const bot: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, bot]);
        setIsLoading(false);
      }, 500);
    }, 0);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40"
          title="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col h-[600px] border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Lipa Mdogo Support</h3>
              <p className="text-xs opacity-90">Always here to help</p>
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

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
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

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-gray-200 space-y-2">
              <p className="text-xs text-gray-600 font-medium">Quick replies:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary px-2 py-1 rounded transition border border-gray-200"
                  >
                    {reply}
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
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
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
