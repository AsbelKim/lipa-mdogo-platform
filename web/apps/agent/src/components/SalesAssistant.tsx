'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';

// Import icons - create a simple chat icon
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

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
      text: `Hi ${agentName || 'there'}! 👋 I'm your Sales Assistant. I can help you with sales tips, customer communication, calculations, and more. What do you need help with?`,
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

  // Comprehensive sales knowledge base
  const salesKnowledge: Record<string, string> = {
    'sales tips': `🎯 **Top Sales Tips for Success:**

1. **Build Rapport First**
   - Start with genuine conversation
   - Ask about their needs before selling
   - Listen more than you talk

2. **Present Benefits, Not Features**
   - Don't just say "12-month financing"
   - Say "Get your phone NOW, pay just KES 4,167/month"
   - Focus on customer's need to own device immediately

3. **Use the 3-Tier Approach**
   - Budget Option: Small device, lower payment
   - Popular Option: Mid-range, proven model
   - Premium Option: Latest tech, if customer can afford
   - Most people choose middle option!

4. **Handle Objections Positively**
   - "I can't afford it" → "What monthly payment works for you?"
   - "Let me think" → "Perfect! When should I follow up?"
   - "Too expensive" → "Compared to what? What's your budget?"

5. **Close with Confidence**
   - "Shall we start with the iPhone 12 then?"
   - "Let's get your papers signed today"
   - Assume the sale and move forward

💡 **Bonus Tip:** Track which device sells best in your area and push that first!`,

    'customer scripts': `📝 **Ready-to-Use Sales Scripts:**

**Opening (First 30 seconds):**
"Hi! Thanks for stopping by. I help people own the latest phones without paying everything upfront. Are you looking for a smartphone right now? What's your budget?"

**Value Proposition:**
"Instead of saving for 6 months, you can own it TODAY and spread payments over 12 months. Just KES 4,167 per month for a brand new device."

**Handling "Too Expensive":**
"Think of it this way - that's the price of 2 cups of coffee per day. Most people earn that in sales of just ONE phone. Makes sense?"

**Building Urgency:**
"I have 3 iPhone 12s in stock, and they move fast. Should I set one aside for you while you think about it?"

**Closing (Assumptive):**
"Perfect! Let's get started. First, I need your ID and phone number. Do you prefer M-Pesa or cash for the deposit?"

**Follow-up (After no sale):**
"No problem! Here's my number - when you're ready, just text me. I promise to find you the best deal in town."

✨ **Key:** Sound genuine, not scripted. Adapt to each customer!`,

    'commission calc': `💰 **Commission Calculation Guide:**

**Your Commission Rate:** 12% of every sale

**Quick Examples:**

Phone Price    | Monthly Payment | Your Commission
KES 25,000     | KES 2,083 (12mo)| KES 3,000
KES 50,000     | KES 4,167 (12mo)| KES 6,000
KES 75,000     | KES 6,250 (12mo)| KES 9,000
KES 100,000    | KES 8,333 (12mo)| KES 12,000

**Monthly Target:** KES 500,000 in sales
→ Earns you: **KES 60,000** in commission!

**Formula:** Sale Amount × 0.12 = Your Commission

**Pro Tip:**
- 5 × KES 50k sales = KES 30,000 commission
- 10 × KES 30k sales = KES 36,000 commission
- Mix sizes, prioritize volume!

📊 **Track in Earnings Dashboard** to watch your commission grow in real-time!`,

    'lead strategies': `🎯 **Lead Generation & Conversion Strategies:**

**Where to Find Leads:**

1. **Location-Based**
   - Visit market centers, shopping areas
   - Talk to shop owners, traders
   - They need phones for inventory
   - High-value customers!

2. **Personal Network**
   - Friends & family (free leads!)
   - Ask existing customers for referrals
   - "Do you know 3 people who'd love a new phone?"
   - Referral incentive: "I'll give you credit for next purchase"

3. **Workplace Visits**
   - Talk to companies, offices, schools
   - Bulk deals for employees
   - Stable income = good credit

4. **WhatsApp Status**
   - Post attractive phone pics with price
   - Update daily with new deals
   - "Available Today" angle
   - Use emojis and clear call-to-action

**Conversion Tips:**

✅ **First Contact to Sale: 24 hours**
- Don't wait, momentum matters
- "Can I stop by tomorrow at 2pm?"

✅ **Qualify Fast**
- Budget? (Price range they want)
- Need? (Personal or resale)
- Timeline? (Today or next month)
- Budget + Need = SELL

✅ **Use Social Proof**
- "I sold 3 of these this week"
- Show happy customer feedback
- "They love it!"

**Monthly Target Breakdown:**
- 10 sales × KES 50k = KES 500k (target reached!)
- 2 sales/week is achievable
- You got this! 💪`,

    'financing terms': `📋 **Financing Terms Explained (For You & Customers):**

**What is Hire Purchase?**
- Customer pays deposit (down payment)
- Then pays monthly installment
- After final payment, owns the phone
- It's safe for both sides

**Key Terms:**

**Down Payment (Deposit)**
- Usually 20-30% of phone price
- Customer pays TODAY
- Shows commitment
- Protects company from default

**Monthly Installment**
- Fixed amount customer pays monthly
- Same amount every month
- For 6, 12, 18, 24, or 36 months
- Simple to track and calculate

**Interest (Hidden in financing)**
- Already built into our pricing
- Customer doesn't pay extra interest
- More months = slightly higher total
- Still affordable!

**Example Breakdown:**
```
iPhone 12 Sale Price: KES 50,000
Down Payment (20%): KES 10,000 [Customer pays today]
Remaining Balance: KES 40,000
Duration: 12 months
Monthly Installment: KES 4,167 × 12 = KES 50,000

Total Cost: KES 10,000 + KES 50,000 = KES 60,000
Markup: KES 10,000 (20%)
```

**Talking Points for Customers:**
- "No interest, just a convenient payment plan"
- "Spread the cost over 12 months"
- "Only KES 4,167 per month for a brand new iPhone!"
- "Safe for both of us - we trust you to pay"

**Your Earnings:**
- Commission on full sale price (KES 50,000)
- 12% = KES 6,000 (paid once deal closes)`,

    'handling objections': `🛡️ **Handling Common Objections:**

**"The phone is too expensive"**
❌ Don't: "No it's not, it's a good price"
✅ Do: "Which price range works better for you? Maybe the Samsung at KES 35k?"

**"Let me think about it"**
❌ Don't: "Sure, call me later"
✅ Do: "I understand! What specific questions do you have? Let's solve them now."

**"I don't have enough for down payment"**
❌ Don't: "Sorry, can't help"
✅ Do: "What can you pay today? Let's work with that number."

**"I'll buy next month"**
❌ Don't: "Okay, goodbye"
✅ Do: "Great! I'll set one aside. When exactly next month? Let's set a date."

**"Your competitor is cheaper"**
❌ Don't: "No we're not"
✅ Do: "Tell me their price. I bet our warranty/service is better. Let me show you..."

**"The phone is too new (risky)"**
❌ Don't: "It's safe, trust me"
✅ Do: "Actually, newer = better technology = lasts longer. Plus we have warranty."

**"I need to ask my spouse"**
❌ Don't: "Come back with them"
✅ Do: "Smart decision! Can I talk to them now via phone? Quick 2-minute call?"

**Golden Rule:**
💡 **NEVER argue. Always agree, then redirect.**
- "You're right, price matters!" (Agree)
- "Let's find you the best value" (Redirect)`,

    'motivation': `💪 **Sales Motivation & Energy:**

**Remember Your Goals:**
- Monthly Target: KES 500,000
- Monthly Commission: KES 60,000
- That's better than many jobs!
- You control your earnings!

**You Are NOT:**
- A discount provider
- A convincer
- Desperate for sales

**You ARE:**
- A problem solver
- Giving people access to tech NOW
- Creating value
- Earning commissions!

**Daily Affirmations:**
✨ "I am a great salesman"
✨ "My customers love me"
✨ "I'll hit my target this month"
✨ "Every 'no' brings me closer to 'yes'"
✨ "I earn KES 6,000 per sale - I deserve this"

**When You're Tired:**
- Remember your commission goals
- Think about happiest customer
- Imagine hitting monthly target
- The next customer could be the one!

**Celebrate Wins:**
🎉 First sale? YES!
🎉 Hit weekly target? YES!
🎉 Customer referral? YES!
🎉 Hit monthly target? BIG YES!

**You've got this! Keep pushing! 🚀**`,
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
    setInputValue('');
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const userInput = inputValue.toLowerCase();
      let botResponse = '';

      // Check for matching topics
      for (const [key, response] of Object.entries(salesKnowledge)) {
        if (userInput.includes(key.split(' ')[0])) {
          botResponse = response;
          break;
        }
      }

      // Default response if no match
      if (!botResponse) {
        const suggestions = [
          'Ask me about "sales tips" for proven techniques',
          'Request "customer scripts" for real conversations',
          'Ask "how to calculate commission" or "commission calc"',
          'Get "lead strategies" to find more customers',
          'Learn about "financing terms" to explain to customers',
          'Ask about "handling objections" for tough situations',
          'Get motivated with "motivation"!',
        ];

        botResponse =
          `I can help with that! Try asking about:\n\n${suggestions.join('\n')}\n\nOr ask me anything about selling phones!`;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition z-40"
        title="Sales Assistant"
      >
        <div className="w-6 h-6">
          <ChatIcon />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-40 max-h-96">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-bold">Sales Assistant 🤖</h3>
          <p className="text-xs text-blue-100">Always here to help</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-blue-800 p-1 rounded transition"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-200 rounded-bl-none">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 bg-white border-t border-gray-200 space-y-2">
          <p className="text-xs font-medium text-gray-600">Quick topics:</p>
          <div className="flex flex-wrap gap-2">
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
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
