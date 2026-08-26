import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck } from 'lucide-react';
import { useCartContext } from '../../context/CartContext';

const TOAST_DURATION_SECONDS = 3;

const Toast = () => {
  const { toastMessage } = useCartContext();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-end p-4 sm:p-5"
    >
      <AnimatePresence>
        {toastMessage !== null && (
          <motion.div
            key={toastMessage}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.94 }}
            transition={{ type: 'spring', damping: 24, stiffness: 380 }}
            className="pointer-events-auto relative flex max-w-xs items-center gap-3 overflow-hidden rounded-2xl bg-primary-container py-3.5 pl-4 pr-5 text-on-primary-container shadow-2xl ring-1 ring-black/10"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <CircleCheck className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium leading-snug">{toastMessage}</p>
            <motion.span
              aria-hidden="true"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: TOAST_DURATION_SECONDS,
                ease: 'linear'
              }}
              className="absolute bottom-0 left-0 h-[3px] bg-secondary-container"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
