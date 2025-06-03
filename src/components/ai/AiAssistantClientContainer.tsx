// src/components/ai/AiAssistantClientContainer.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/ai/ChatInterface';
import AiAssistantSidebar from '@/components/ai/AiAssistantSidebar';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/client';
import { Loader2, LogIn, Sparkles, PanelRightOpen } from 'lucide-react';

interface AiAssistantClientContainerProps {
  locale: string;
}

export default function AiAssistantClientContainer({ locale }: AiAssistantClientContainerProps) {
  const { currentUser, loading, signInWithGoogle } = useAuth();
  const { t } = useTranslation(locale, 'common');
  const [clearChatTrigger, setClearChatTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNewChat = () => {
    setClearChatTrigger(prev => prev + 1);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center flex-grow pt-10 bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow text-center p-6 space-y-6 bg-background text-foreground h-full">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            {t('pages.aiAssistant.signInRequiredTitle')}
          </h2>
          <p className="text-muted-foreground max-w-md">
            {t('pages.aiAssistant.signInRequiredMessage')}
          </p>
        </div>
        <Button onClick={signInWithGoogle} size="lg" variant="default">
          <LogIn className="mr-2 h-5 w-5" />
          {t('pages.aiAssistant.signInWithGoogleButton')}
        </Button>
      </div>
    );
  }

  //console.log('Translation for disclaimer:', t('pages.aiAssistant.disclaimer'));

  return (
    <div className="flex h-full w-full overflow-hidden relative border border-border rounded-lg"> {/* Moved border here */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="absolute top-3 left-3 z-30 text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label={t('pages.aiAssistant.sidebar.openSidebar')}
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      )}
      <AiAssistantSidebar
        locale={locale}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      <div className="flex flex-col flex-grow h-full bg-background overflow-hidden">
        <ChatInterface locale={locale} clearChatTrigger={clearChatTrigger} />
      </div>
    </div>
  );
}
