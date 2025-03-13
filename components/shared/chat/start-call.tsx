import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function StartCall() {
  const { status, connect } = useVoice();
  console.log(status.value);
  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={
            "fixed inset-0 flex h-full w-full items-center justify-center bg-background p-4"
          }
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className={"z-50 flex items-center gap-1.5"}
                onClick={() => {
                  connect()
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {});
                }}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50"}
                    strokeWidth={2}
                    stroke={"currentColor"}
                  />
                </span>
                {status.value === "connecting" ? (
                  <span>Connecting...</span>
                ) : (
                  <span>Start Call</span>
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
