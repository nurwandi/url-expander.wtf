import React, { createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";

import type {
  GlobalOptions as ConfettiGlobalOptions,
  Options as ConfettiOptions,
  CreateTypes as ConfettiInstance,
} from "canvas-confetti";

import confetti from "canvas-confetti";

interface ConfettiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options?: ConfettiOptions & ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
  children?: React.ReactNode;
}

export interface ConfettiRef {
  fire: () => void;
}

const ConfettiButton = forwardRef<ConfettiRef, ConfettiButtonProps>(
  ({ options, children, ...props }, ref) => {
    const confettiInstance = useRef<ConfettiInstance | null>(null);

    useImperativeHandle(ref, () => ({
      fire: () => {
        if (confettiInstance.current) {
          confettiInstance.current(options);
        }
      },
    }));

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      confettiInstance.current &&
        confettiInstance.current({
          ...options,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
        });
      props.onClick?.(event);
    };

    useEffect(() => {
      confettiInstance.current = confetti.create(undefined, {
        resize: true,
        useWorker: true,
      });

      return () => {
        confettiInstance.current?.reset();
      };
    }, []);

    return (
      <button {...props} onClick={onClick}>
        {children}
      </button>
    );
  }
);

ConfettiButton.displayName = "ConfettiButton";

export { ConfettiButton };
