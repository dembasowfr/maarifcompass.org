
'use client';

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizontal, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { simpleChat, type SimpleChatInput, type SimpleChatOutput } from '@/ai/flows/chatFlow';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  locale: string;
  clearChatTrigger?: number;
}

export default function ChatInterface({ locale, clearChatTrigger }: ChatInterfaceProps) {
  const { t } = useTranslation(locale, 'common');
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (clearChatTrigger && clearChatTrigger > 0) {
      setMessages([]);
      setMessages([{
        id: Date.now().toString() + '-ai-welcome',
        text: t('pages.aiAssistant.welcomeMessageCleared', { name: currentUser?.displayName || t('common.user', { ns: 'common'}) }),
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  }, [clearChatTrigger, t, currentUser]);

  useEffect(() => {
    if (messages.length === 0 && currentUser) {
      setMessages([{
        id: Date.now().toString() + '-ai-initial-welcome',
        text: t('pages.aiAssistant.welcomeTitle', { name: currentUser?.displayName || t('common.user', { ns: 'common'}) }),
        sender: 'ai',
        timestamp: new Date(),
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);


  const handleSendMessage = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const chatInput: SimpleChatInput = { 
        query: currentInput,
        userName: currentUser?.displayName || undefined,
      };
      const aiResult: SimpleChatOutput = await simpleChat(chatInput);

      const aiResponse: Message = {
        id: Date.now().toString() + '-ai',
        text: aiResult.response,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error calling Genkit flow:", error);
      const errorMessageText = t('pages.aiAssistant.errorResponse');
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: errorMessageText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      toast({
        variant: "destructive",
        title: t('pages.aiAssistant.errorTitle'),
        description: errorMessageText,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow h-full bg-background overflow-hidden"> {/* Removed border and rounded-lg */}
      <ScrollArea className="flex-grow p-4 sm:p-6" ref={scrollAreaRef}>
        {messages.length === 0 && !isLoading && !currentUser && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">
              {t('pages.aiAssistant.welcomeTitleDefault')}
            </h2>
            <p className="text-muted-foreground">{t('pages.aiAssistant.welcomeSubtitle')}</p>
          </div>
        )}
        <div className="space-y-6 w-full pb-4"> 
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start space-x-3',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 self-start flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg shadow-md max-w-[80%]',
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-muted-foreground rounded-bl-none'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={cn(
                    "text-xs mt-1",
                    message.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80 text-left'
                  )}>
                  {message.timestamp.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && currentUser && (
                 <Avatar className="h-8 w-8 self-start flex-shrink-0">
                  <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || t('navbar.user', {ns: 'common'})} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User size={20}/>}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start space-x-3 mr-auto justify-start max-w-[80%]">
              <Avatar className="h-8 w-8 self-start flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="p-3 rounded-lg shadow-md bg-muted text-muted-foreground rounded-bl-none">
                <div className="flex space-x-1 items-center">
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse delay-75"></span>
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse delay-150"></span>
                  <span className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-pulse delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="bg-background p-3 sm:p-4"> {/* Removed border-t, as parent will have border */}
        <div className="w-full"> 
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2 bg-card p-2 rounded-xl shadow-md border border-border">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('pages.aiAssistant.inputPlaceholderChatGPT')}
              className="flex-grow resize-none min-h-[2.5rem] max-h-32 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-2.5"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label={t('pages.aiAssistant.sendButton')} className="bg-primary hover:bg-accent text-primary-foreground disabled:bg-muted disabled:text-muted-foreground h-10 w-10 flex-shrink-0">
              <SendHorizontal size={20} />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2 px-2">
            {t('pages.aiAssistant.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
