import { motion, AnimatePresence } from "framer-motion";
import { CircularProgress } from "@mui/material";

export function LoadingPop({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-2000 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >

<CircularProgress size="4rem" thickness={6}  sx={{ color: "#f8bbd0" }}/>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}