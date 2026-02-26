import { useRef, useEffect } from 'react';

export function useDraggableScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.pageX - ele.offsetLeft;
      scrollLeft.current = ele.scrollLeft;
      hasDragged.current = false;
      ele.style.cursor = 'grabbing';
      ele.style.userSelect = 'none';
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      ele.style.cursor = 'grab';
      ele.style.userSelect = '';
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDragging.current = false;
      ele.style.cursor = 'grab';
      ele.style.userSelect = '';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - ele.offsetLeft;
      const walk = (x - startX.current) * 2; // Scroll-fast
      
      if (Math.abs(x - startX.current) > 5) {
        hasDragged.current = true;
      }
      
      ele.scrollLeft = scrollLeft.current - walk;
    };

    const handleClick = (e: MouseEvent) => {
      if (hasDragged.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    ele.addEventListener('mousedown', handleMouseDown);
    ele.addEventListener('mouseleave', handleMouseLeave);
    ele.addEventListener('mouseup', handleMouseUp);
    ele.addEventListener('mousemove', handleMouseMove);
    ele.addEventListener('click', handleClick, true); // Use capture phase

    // Initial cursor
    ele.style.cursor = 'grab';

    return () => {
      ele.removeEventListener('mousedown', handleMouseDown);
      ele.removeEventListener('mouseleave', handleMouseLeave);
      ele.removeEventListener('mouseup', handleMouseUp);
      ele.removeEventListener('mousemove', handleMouseMove);
      ele.removeEventListener('click', handleClick, true);
    };
  }, []);

  return ref;
}
