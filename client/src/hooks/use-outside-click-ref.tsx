import { useCallback, useEffect, useRef } from 'react';

const useOutsideClickRef = (onClose: () => void) => {
  const ref = useRef(null);

  const escapeListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  const clickListener = useCallback(
    (e: MouseEvent) => {
      const el = ref.current! as any;
      if (el && !el.contains(e.target)) {
        onClose?.();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('click', clickListener);
    document.addEventListener('keyup', escapeListener);
    return () => {
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keyup', escapeListener);
    };
  }, [clickListener, escapeListener]);

  return ref;
};

export default useOutsideClickRef;
