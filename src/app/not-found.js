"use client";

import { AnimatePresence, motion } from "framer-motion";

function NotFound() {
  return (
    <div className="w-full flex justify-center items-center py-20">
      <div className="px-4">
        <div className="mb-4 mx-auto w-[280px]">
          <AnimatePresence>
            <motion.img
              animate={{
                x: [-50, 0, -50, 0, -50],
                borderRadius: [100, 30, 150, 100],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
              }}
              src="/notfound.gif"
              width={280}
              alt="not found"
            />
          </AnimatePresence>
        </div>
        <h1 className="font-bold text-4xl">404 - Page not found</h1>
        <p className="text-gray-600 mt-4 text-2xl">
          URL maybe deleted or something wrong!
        </p>
      </div>
    </div>
  );
}

export default NotFound;
