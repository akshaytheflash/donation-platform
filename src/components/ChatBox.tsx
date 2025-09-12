import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChatBox = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: input },
      { sender: 'bot', text: 'Please wait for one of our volunteers to assist you' }
    ]);
    setInput('');
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
          <div className="text-muted-foreground text-sm mb-2">Ask your query below to start chatting.</div>
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
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;