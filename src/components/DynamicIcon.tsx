// src/components/DynamicIcon.tsx
'use client'; // If it needs to be a client component, but for simple mapping, server is fine.
              // However, lucide-react icons themselves are client components.
              // For server components, you'd typically pass the imported icon component as a prop.
              // Given this is dynamically choosing an icon, making it client or carefully structuring is needed.
              // Let's assume it can be a server component if used carefully, or make it client.
              // For simplicity with dynamic selection based on string, client makes it easier.
              // Update: lucide-react icons can be used in server components.

import type { FC } from 'react';
import { BookOpen, Briefcase, Users, HelpCircle, type LucideProps } from 'lucide-react';

// Add any other icons you plan to use from Firestore here
const iconMap: Record<string, FC<LucideProps>> = {
  BookOpen,
  Briefcase,
  Users,
  HelpCircle, // Default or fallback
  // Add more icons as needed, e.g., for news, events if specified by iconName
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

const DynamicIcon: FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || iconMap['HelpCircle']; // Fallback to HelpCircle

  if (!IconComponent) {
    // This case should ideally be handled by the fallback in iconMap
    console.warn(`Icon "${name}" not found.`);
    return null; 
  }
  return <IconComponent {...props} />;
};

export default DynamicIcon;
