import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatBox = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Build system prompt
    const systemPrompt = `You are an expert support agent for my website Donify (https://msit-crypto.vercel.app).
Donify lets users host their own campaigns (/start-campaign), donate to campaigns (/campaigns), 
supports every payment method including crypto/Metamask, allows anonymous donations, 
uses blockchain for transparent records, and provides certificates for donations.

The user asks: ${input}
Answer clearly and helpfully. If you don’t know the answer, say you don’t know.`;

    try {
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemma-3n-e2b-it:generateContent?key=AIzaSyCsai3htcrZAjnS1xN8MNWdYmz152YkNy0',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error: ${res.status} - ${errText}`);
      }

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I could not process your request.';

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    } catch (err: any) {
      console.error('Chat API error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 shadow-lg rounded-lg bg-white border border-border flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-semibold">Live Chat</span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 300 }}>
        {messages.length === 0 && (
          <div className="text-muted-foreground text-sm mb-2">
            Ask your query below to start chatting.
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg text-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-2 flex justify-start">
            <div className="px-3 py-2 rounded-lg text-sm bg-muted/50 text-muted-foreground">
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex p-2 border-t gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
