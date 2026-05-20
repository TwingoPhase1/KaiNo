'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Props interface for AnimatedListItem component
 * 
 * @param children - The content to be animated (typically a Card component)
 * @param index - The position of this item in the list (used for staggered animation)
 * @param onDelete - Optional callback when item is deleted (currently unused but kept for future)
 */
interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  onDelete?: () => void;
}

/**
 * AnimatedListItem - Wraps list items with smooth entrance and exit animations
 * 
 * This component provides a premium feel by animating items as they appear and disappear.
 * It uses Framer Motion's declarative animation API for smooth, GPU-accelerated animations.
 * 
 * Animation Strategy:
 * - Entrance: Items fade in and slide up from below (y: 20 -> y: 0)
 * - Exit: Items fade out and slide left (x: -100)
 * - Stagger: Each item has a slight delay based on its index (creates wave effect)
 * - Layout: Automatically animates layout changes when items are reordered
 * 
 * Performance:
 * - Uses GPU-accelerated transforms (opacity, translate)
 * - 0.2s duration is fast but noticeable
 * - Staggered delay (index * 0.05s) creates pleasing wave effect
 * - Layout prop ensures smooth reordering animations
 * 
 * Use Case:
 * - Wrap each list item in this component
 * - Pass the item's index for staggered animation
 * - Items will animate in when list loads
 * - Items will animate out when deleted
 * 
 * @param props - AnimatedListItemProps containing children, index, and optional onDelete
 * @returns Motion.div component with animation configuration
 */
export function AnimatedListItem({ children, index, onDelete }: AnimatedListItemProps) {
  return (
    <motion.div
      // Initial state: invisible and positioned 20px below final position
      // This creates the "slide up from below" entrance effect
      initial={{ opacity: 0, y: 20 }}
      
      // Animate to: fully visible and at final position
      // This is the target state after animation completes
      animate={{ opacity: 1, y: 0 }}
      
      // Exit state: invisible and positioned 100px to the left
      // This creates the "slide left" deletion effect
      exit={{ opacity: 0, x: -100 }}
      
      // Transition configuration
      transition={{
        duration: 0.2,           // Animation duration in seconds (fast but noticeable)
        delay: index * 0.05,      // Staggered delay based on item index (creates wave effect)
                                // Item 0: 0ms delay, Item 1: 50ms delay, Item 2: 100ms delay, etc.
      }}
      
      // Enable layout animations
      // This automatically animates when items are reordered or layout changes
      // Essential for smooth drag-and-drop or reordering operations
      layout
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedContainer - Wraps entire page/section with fade animation
 * 
 * This component provides a smooth fade-in effect for page transitions.
 * It's used to wrap the entire list detail page for a polished entrance animation.
 * 
 * Animation Strategy:
 * - Simple fade in/out (opacity: 0 -> opacity: 1)
 * - 0.3s duration for smooth but not slow transition
 * - No stagger needed (entire container animates at once)
 * 
 * Use Case:
 * - Wrap entire page content
 * - Provides smooth page load animation
 * - Prevents jarring content appearance
 * 
 * Performance:
 * - Simple opacity animation (very fast)
 * - No layout calculations needed
 * - Minimal performance impact
 * 
 * @param children - The content to be wrapped with fade animation
 * @returns Motion.div component with fade animation configuration
 */
export function AnimatedContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      // Initial state: invisible
      initial={{ opacity: 0 }}
      
      // Animate to: fully visible
      animate={{ opacity: 1 }}
      
      // Exit state: invisible (for route transitions)
      exit={{ opacity: 0 }}
      
      // Transition configuration
      transition={{ duration: 0.3 }}  // 0.3s fade duration (smooth but not slow)
    >
      {children}
    </motion.div>
  );
}
