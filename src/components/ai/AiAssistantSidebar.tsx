
'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/lib/i18n/client';
import Link from 'next/link';
import {
  PlusSquare,
  MessageSquare,
  ChevronDown,
  Bot,
  Users,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiAssistantSidebarProps {
  locale: string;
  onNewChat: () => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

const AiAssistantSidebar: FC<AiAssistantSidebarProps> = ({
  locale,
  onNewChat,
  isOpen,
  onToggleSidebar,
}) => {
  const { t } = useTranslation(locale, 'common');
  const { currentUser, signOutUser } = useAuth();

  const chatHistoryGroups = [
    {
      labelKey: 'pages.aiAssistant.sidebar.today',
      chats: [{ id: '1', title: 'First conversation topic' }, { id: '2', title: 'Maarif documents summary' }],
    },
    {
      labelKey: 'pages.aiAssistant.sidebar.yesterday',
      chats: [{ id: '3', title: 'Help with visa application' }],
    },
  ];

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-card text-card-foreground border-r border-border transition-all duration-300 ease-in-out',
        isOpen ? 'w-64 p-3 space-y-2' : 'w-0 p-0 space-y-0 overflow-hidden'
      )}
    >
      {/* Header / Logo Area */}
      <div className={cn('flex items-center justify-between p-2 mb-2', !isOpen && 'hidden')}>
        <Button variant="ghost" className="flex items-center space-x-2 p-0 hover:bg-muted w-full justify-start">
          <Bot className="h-7 w-7 text-primary" />
          <span className="font-semibold text-foreground">{t('appName')}</span>
          <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
        </Button>
        <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label={isOpen ? t('pages.aiAssistant.sidebar.closeSidebar') : t('pages.aiAssistant.sidebar.openSidebar')}
          >
            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>
       {/* This button is visible when sidebar is closed, positioned outside or in a minimal strip */}
       {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="absolute top-4 left-2 z-10 text-muted-foreground hover:text-foreground hover:bg-muted md:hidden" 
          // md:hidden because on desktop, a different trigger might be preferred or no trigger if it's part of layout.
          // For now, let's keep a way to open it on mobile when closed.
          aria-label={t('pages.aiAssistant.sidebar.openSidebar')}
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )}


      {/* New Chat Button */}
      <Button
        onClick={onNewChat}
        variant="outline"
        className={cn(
          'w-full justify-start bg-transparent border-border hover:bg-muted text-foreground space-x-2',
          !isOpen && 'hidden'
        )}
      >
        <PlusSquare className="h-5 w-5" />
        <span>{t('pages.aiAssistant.sidebar.newChat')}</span>
      </Button>

      <ScrollArea className={cn('flex-grow my-2', !isOpen && 'hidden')}>
        {/* Chat History */}
        <div className="mt-4 space-y-4">
          {chatHistoryGroups.map((group) => (
            <div key={group.labelKey}>
              <h3 className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t(group.labelKey)}
              </h3>
              <div className="mt-1 space-y-0.5">
                {group.chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground hover:bg-muted hover:text-foreground space-x-2 truncate"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="truncate">{chat.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer / User Profile */}
      <div className={cn('mt-auto border-t border-border pt-3 space-y-2', !isOpen && 'hidden')}>
        {currentUser && (
          <div className="group relative flex items-center space-x-2 p-2 rounded-md hover:bg-muted cursor-pointer">
            <Avatar className="h-7 w-7">
              <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'User'} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <Users size={12} />}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate text-foreground">{currentUser.displayName || 'User'}</span>
             <Button variant="ghost" size="icon" className="ml-auto text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={signOutUser} aria-label={t('navbar.signOut')}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistantSidebar;
