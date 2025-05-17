
'use client';

import { cn } from '@/lib/utils';
import {
  DndContext,
  type DragEndEvent,
  rectIntersection,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { ReactNode } from 'react';

type Status = {
  id: string;
  name: string;
  color: string;
};

type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: Status;
};

export type ListItemsProps = {
  children: ReactNode;
  className?: string;
};

export const ListItems = ({ children, className }: ListItemsProps) => (
  <div className={cn('flex flex-1 flex-col gap-3 p-0', className)}> {/* Adjusted gap and padding */}
    {children}
  </div>
);

export type ListHeaderProps =
  | {
      children: ReactNode;
    }
  | {
      name: Status['name'];
      color: Status['color'];
      className?: string;
    };

export const ListHeader = (props: ListHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div
      className={cn(
        'flex shrink-0 items-center gap-2 bg-muted/80 p-3 rounded-t-md', // Use muted for less emphasis, rounded top
        props.className
      )}
    >
      {props.color && <div
        className="h-2.5 w-2.5 rounded-full" // Slightly larger dot
        style={{ backgroundColor: props.color }}
      />}
      <p className="m-0 font-semibold text-foreground text-md">{props.name}</p> {/* Use foreground, larger text */}
    </div>
  );

export type ListGroupProps = {
  id: string; // Can be any string, not just Status['id']
  children: ReactNode;
  className?: string;
};

export const ListGroup = ({ id, children, className }: ListGroupProps) => {
  // DND not used for AI output, so isOver is not critical here
  // const { setNodeRef, isOver } = useDroppable({ id });
  // For non-DND use, setNodeRef can be simplified or removed if not needed for other effects
  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow-md', // Use card for distinct sections
        // isOver && 'bg-foreground/10', // Remove hover effect related to DND
        className
      )}
      // ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type ListItemProps = {
  id: string;
  children: ReactNode; // Prioritize children for flexible content
  name?: string; // Optional name, mainly if children are not provided
  index?: number; // Optional for DND, may not be needed for static lists
  parent?: string; // Optional for DND
  className?: string;
};

export const ListItem = ({
  id,
  name,
  index,
  parent,
  children,
  className,
}: ListItemProps) => {
  // DND hooks are not used for static AI output display
  // const { attributes, listeners, setNodeRef, transform, isDragging } =
  //   useDraggable({
  //     id,
  //     data: { index, parent },
  //   });

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border border-border bg-background p-4 shadow-sm", // More padding, standard border
        "transition-all duration-200 ease-in-out hover:shadow-md hover:border-primary/50", // Subtle hover
        // isDragging && 'cursor-grabbing', // No dragging
        className
      )}
      // style={{ // No transform needed for static items
      //   transform: transform
      //     ? `translateX(${transform.x}px) translateY(${transform.y}px)`
      //     : 'none',
      // }}
      // {...listeners} // No DND listeners
      // {...attributes} // No DND attributes
      // ref={setNodeRef} // No DND ref
    >
      {children ?? <p className="m-0 font-medium text-sm text-foreground">{name}</p>}
    </div>
  );
};

// ListProvider is for DND, not strictly necessary for static display
// but can be kept if other DND features might be added later.
// For now, onDragEnd can be a no-op or not used.
export type ListProviderProps = {
  children: ReactNode;
  onDragEnd?: (event: DragEndEvent) => void; // Make onDragEnd optional
  className?: string;
};

export const ListProvider = ({
  children,
  onDragEnd,
  className,
}: ListProviderProps) => (
  <DndContext
    collisionDetection={rectIntersection}
    onDragEnd={onDragEnd ?? (() => {})} // Provide a no-op if onDragEnd is not given
    modifiers={[restrictToVerticalAxis]}
  >
    <div className={cn('flex flex-col gap-4', className)}>{children}</div> {/* Added gap for groups */}
  </DndContext>
);
