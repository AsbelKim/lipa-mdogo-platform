'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SalesAssistantProps {
  agentId?: string;
  agentName?: string;
}

export default function SalesAssistant({ agentId, agentName }: SalesAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Hi ${agentName || 'Agent'}! 👋 I'm your Sales Assistant. Ask me about sales tips, customer scripts, commission calculations, lead strategies, and more!`,
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
    'Sales tips',
    'Customer scripts',
    'Commission calc',
    'Lead strategies',
    'Financing terms',
  ];

  const salesKnowledge: Record<string, string> = {
    'sales tips': `🎯 **Top Sales Tips:**

1. **Build Rapport** - Start with genuine conversation
2. **Benefits Over Features** - Don't say "12-month plan", say "Only KES 4,167/month for a new phone"
3. **3-Tier Approach** - Budget (low), Popular (mid), Premium (high)
4. **Handle Objections** - Turn "I can't afford" into "What payment works for you?"
5. **Close with Confidence** - Assume the sale and move forward

💡 Most customers buy the middle option!`,

    'customer scripts': `📝 **Ready-to-Use Scripts:**

**Opening:** "Hi! I help people own the latest phones without paying everything upfront. What's your budget?"

**Value Prop:** "Instead of saving 6 months, own it TODAY and pay just KES 4,167/month for 12 months!"

**Objection:** "Price matters, that's smart! But think of it like 2 cups of coffee daily. Most people earn that selling ONE phone."

**Closing:** "Let's get started! I need your ID and phone number."

✨ Adapt to each customer - don't sound like a robot!`,

    'commission calc': `💰 **Your Commissions:**

12% of EVERY sale!

Examples:
- KES 25,000 sale = KES 3,000 commission
- KES 50,000 sale = KES 6,000 commission
- KES 75,000 sale = KES 9,000 commission
- KES 100,000 sale = KES 12,000 commission

**Monthly Target:** KES 500,000
→ That's KES 60,000 commission!

5 sales × KES 50k = KES 30,000 commission
10 sales × KES 30k = KES 36,000 commission

Track your earnings in the Earnings tab!`,

    'lead strategies': `🎯 **How to Find Leads:**

**Best Places:**
- Market centers & shops
- Office buildings & companies
- Referrals from existing customers
- WhatsApp status updates
- Friends & family

**Quick Qualification:**
- What's your budget?
- Do you need it for personal or resale?
- When do you need it?

Budget + Need = READY TO SELL!

**Speed Matters:**
Close the sale within 24 hours!`,

    'financing terms': `📋 **Hire Purchase Explained:**

**How it works:**
1. Customer pays deposit (20-30%)
2. Then pays monthly installment
3. After final payment = owns the phone

**Example: KES 50,000 iPhone**
- Down payment: KES 10,000 (today)
- Monthly: KES 4,167 × 12 months
- Total cost: KES 60,000

**Tell customers:**
"No interest, just a convenient payment plan"
"Only KES 4,167/month for a brand new iPhone"
"It's safe for both of us"`,

    'motivation': `💪 **You've Got This!**

Remember:
✨ Each sale = KES 6,000+ commission
✨ You control your earnings
✨ Next customer could be your biggest sale
✨ Hit monthly target = KES 60,000!

Affirmations:
"I am a great salesman"
"My customers love me"
"I will hit my target this month"

Keep pushing! 🚀`,
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = inputValue.toLowerCase();
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = '';

      for (const [key, response] of Object.entries(salesKnowledge)) {
        if (userInput.includes(key.split(' ')[0])) {
          botResponse = response;
          break;
        }
      }

      if (!botResponse) {
        botResponse = `I can help with:\n• Sales tips\n• Customer scripts\n• Commission calc\n• Lead strategies\n• Financing terms\n• Motivation\n\nJust ask! 😊`;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition z-50 flex items-center justify-center text-2xl font-bold"
        title="Sales Assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 max-h-96 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Sales Assistant 🤖</h3>
          <p className="text-xs text-blue-100">Always here to help</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-blue-800 w-6 h-6 rounded flex items-center justify-center text-sm"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 px-3 py-2 rounded border border-gray-200 rounded-bl-none text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-3 py-2 bg-white border-t border-gray-200 space-y-2">
          <p className="text-xs font-medium text-gray-600">Quick topics:</p>
          <div className="flex flex-wrap gap-1">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me..."
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
