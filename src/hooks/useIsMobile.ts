import { useLayoutEffect, useState } from 'react';

export function useIsMobile() {
   const [mobile, setMobile] = useState(false);
   useLayoutEffect(() => {
      function updateSize() {
         const isMobile = window.innerWidth < 768;
         setMobile(isMobile);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
   }, []);
   return mobile;
}
