import { useState } from 'react';
import { useScrollPosition as useGetScrollPosition } from '@n8tb1t/use-scroll-position';

const useScrollPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useGetScrollPosition(({ currPos }) => {
    setPosition(currPos);
  });
  const isBottom =
    window.scrollY + window.innerHeight >= document.body.offsetHeight;
  return { isBottom, ...position };
};

export default useScrollPosition;
