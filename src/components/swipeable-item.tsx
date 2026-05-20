'use client';

import { useRef, useState, ReactNode, TouchEvent } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

/**
 * Props interface for SwipeableItem component
 * 
 * @param children - The content to be made swipeable (typically a Card component)
 * @param onDelete - Callback function triggered when swipe passes threshold
 * @param threshold - Minimum swipe distance in pixels to trigger delete (default: 100)
 */
interface SwipeableItemProps {
  children: ReactNode;
  onDelete: () => void;
  threshold?: number;
}

/**
 * SwipeableItem - Enables swipe-to-delete gesture on mobile devices
 * 
 * This component provides a native-like mobile experience where users can swipe
 * left on an item to reveal a delete button. It mimics the behavior found in
 * iOS and Android list views.
 * 
 * Gesture Strategy:
 * - User swipes left on the item
 * - Delete background (red) becomes visible as item slides
 * - If swipe passes threshold (100px), delete action is triggered
 * - If swipe is cancelled (released before threshold), item springs back
 * - Only allows left swipe (right swipe is prevented)
 * 
 * Visual Feedback:
 * - Content fades as it's swiped (opacity decreases)
 * - Delete button fades in and scales up as swipe progresses
 * - Cursor changes to "grabbing" during drag
 * - Elastic bounce effect when drag is released
 * 
 * Performance:
 * - Uses GPU-accelerated transforms (translate, opacity, scale)
 * - Motion values are optimized by Framer Motion
 * - No layout thrashing (uses transforms only)
 * - Smooth 60fps animations on mobile devices
 * 
 * Use Case:
 * - Wrap list items to enable swipe-to-delete
 * - Provides intuitive mobile interaction
 * - Alternative to delete button for touch devices
 * - Works alongside existing delete button (desktop users can still click)
 * 
 * @param props - SwipeableItemProps containing children, onDelete callback, and optional threshold
 * @returns Div with swipe gesture handling and visual feedback
 */
export function SwipeableItem({ children, onDelete, threshold = 100 }: SwipeableItemProps) {
  // Track if user is currently dragging the item
  const [isDragging, setIsDragging] = useState(false);
  
  // Motion value for horizontal position (x-axis)
  // This tracks the current drag position in real-time
  const x = useMotionValue(0);
  
  // Transform: Fade content as it's swiped left
  // When x = -150px, opacity = 0 (fully faded)
  // When x = 0px, opacity = 1 (fully visible)
  const opacity = useTransform(x, [-150, 0], [0, 1]);
  
  // Transform: Fade in delete button as swipe approaches threshold
  // When x = -threshold, opacity = 1 (fully visible)
  // When x = -threshold + 20, opacity = 0 (hidden)
  // This creates a smooth fade-in effect for the delete button
  const deleteOpacity = useTransform(x, [-threshold, -threshold + 20], [1, 0]);
  
  // Transform: Scale delete button as swipe approaches threshold
  // When x = -threshold, scale = 1 (full size)
  // When x = -threshold + 20, scale = 0.8 (slightly smaller)
  // This creates a subtle scale effect for the delete button
  const deleteScale = useTransform(x, [-threshold, -threshold + 20], [1, 0.8]);

  /**
   * Handle drag end event
   * 
   * This function is called when the user releases the drag gesture.
   * It determines whether to delete the item or reset its position.
   * 
   * Logic:
   * - If swipe distance exceeds threshold (negative x value), trigger delete
   * - Otherwise, spring back to original position (x = 0)
   * - Reset dragging state regardless of outcome
   * 
   * @param event - The drag event (unused but required by Framer Motion)
   * @param info - PanInfo object containing drag information (offset, velocity, etc.)
   */
  const handleDragEnd = (event: any, info: PanInfo) => {
    // Check if swipe distance exceeds threshold (negative because we swipe left)
    if (info.offset.x < -threshold) {
      // Trigger delete callback
      onDelete();
    } else {
      // Reset position to original (spring back animation)
      x.set(0);
    }
    // Reset dragging state
    setIsDragging(false);
  };

  /**
   * Handle drag start event
   * 
   * This function is called when the user begins dragging.
   * It updates the dragging state for potential UI feedback.
   */
  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete background layer */}
      {/* This layer is revealed when the content is swiped left */}
      {/* It contains the "Supprimer" (Delete) text and is styled with destructive color */}
      <motion.div
        className="absolute inset-0 bg-destructive flex items-center justify-end pr-4"
        style={{ opacity: deleteOpacity, scale: deleteScale }}
      >
        <span className="text-destructive-foreground font-medium">Supprimer</span>
      </motion.div>

      {/* Draggable content layer */}
      {/* This is the actual list item that the user swipes */}
      {/* It sits on top of the delete background layer */}
      <motion.div
        // Enable horizontal drag only (x-axis)
        drag="x"
        
        // Constrain drag to left side only (can't drag right)
        // left: 0 prevents dragging beyond left edge
        // right: 0 prevents dragging to the right
        dragConstraints={{ left: 0, right: 0 }}
        
        // Elastic bounce effect when drag is released
        // 0.7 means the element will bounce back 70% of the way before settling
        // This provides a satisfying, spring-like feel
        dragElastic={0.7}
        
        // Callback when drag starts
        onDragStart={handleDragStart}
        
        // Callback when drag ends
        onDragEnd={handleDragEnd}
        
        // Apply motion values for position and opacity
        style={{ x, opacity }}
        
        // Change cursor to "grabbing" while dragging
        // Provides visual feedback that item is being dragged
        whileTap={{ cursor: 'grabbing' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
