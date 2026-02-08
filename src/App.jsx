import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Moon, Sun, Music, VolumeX } from "lucide-react";
import html2canvas from "html2canvas";
import { FaHeart, FaRegHeart, FaHeartbeat } from "react-icons/fa";

export default function App() {
  const [dark, setDark] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const bgMusicRef = useRef(null);
  const ringSoundRef = useRef(null);
  const captureRef = useRef(null);

  const heartIcons = [FaHeart, FaRegHeart, FaHeartbeat];

  const heartColors = [
    "text-pink-400",
    "text-rose-500",
    "text-red-500",
    "text-fuchsia-400",
    "text-purple-400",
  ];

  // 🎵 Music control (after user interaction)
  useEffect(() => {
    if (!bgMusicRef.current) return;
    musicOn ? bgMusicRef.current.play() : bgMusicRef.current.pause();
  }, [musicOn]);

  // 🙈 Runaway NO button
  const moveNo = () => {
    setNoPos({
      x: Math.random() * 220 - 110,
      y: Math.random() * 160 - 80,
    });
  };

  // 💖 YES handler
  const handleYes = async () => {
    setAccepted(true);
    setCelebrate(true);

    // Ring sound
    ringSoundRef.current?.play();

    // Cinematic fullscreen
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }

    // Popup after animation
    setTimeout(() => setShowPopup(true), 1200);
  };

  // 📸 Capture proposal moment
  const captureScreenshot = async () => {
    if (!captureRef.current) return;

    // TEMP FIX: remove backdrop + gradients
    captureRef.current.classList.add("screenshot-safe");

    await new Promise((r) => setTimeout(r, 100));

    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    captureRef.current.classList.remove("screenshot-safe");

    const link = document.createElement("a");
    link.download = "valentine-moment.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className={`${
        dark
          ? "bg-[#0b0b0f]"
          : "bg-linear-to-br from-pink-500 via-rose-500 to-red-500"
      } min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-700`}
    >
      {/* 🎵 Audio */}
      <audio ref={bgMusicRef} src="/love.mp3" loop />
      <audio ref={ringSoundRef} src="/ring-click.mp3" />

      {/* 🌸 Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => {
          const Icon =
            heartIcons[Math.floor(Math.random() * heartIcons.length)];
          const color =
            heartColors[Math.floor(Math.random() * heartColors.length)];
          const size = 18 + Math.random() * 18;

          return (
            <motion.div
              key={i}
              initial={{
                y: -40,
                x: Math.random() * window.innerWidth,
                opacity: 0,
              }}
              animate={{
                y: "110vh",
                opacity: [0, 1, 1, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 7 + Math.random() * 5,
                repeat: Infinity,
                delay: i * 0.35,
                ease: "linear",
              }}
              className="absolute"
            >
              <Icon className={`${color}`} size={size} />
            </motion.div>
          );
        })}
      </div>

      {/* 💌 Proposal Card */}
      <motion.div
        ref={captureRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-[94%] max-w-md bg-white/20 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(255,0,128,0.4)]"
      >
        {/* Header */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-white/30"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setMusicOn(!musicOn)}
            className="p-2 rounded-full bg-white/30"
          >
            {musicOn ? <Music size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        {/* ❤️ Heart */}
        <motion.div
          animate={
            celebrate
              ? { scale: [1, 1.5, 1], rotate: [0, 360] }
              : { scale: [1, 1.15, 1] }
          }
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center"
        >
          <Heart className="w-20 h-20 text-red-500 fill-red-500 drop-shadow-xl" />
        </motion.div>

        <h1 className="mt-4 text-center text-3xl font-extrabold text-white">
          Will you be my Valentine? 💌
        </h1>

        {/* 💬 WhatsApp-style messages */}
        <div className="mt-6 space-y-2">
          <div className="ml-auto bg-green-500 text-white px-4 py-2 rounded-2xl w-fit">
            Hey ❤️
          </div>
          <div className="ml-auto bg-green-500 text-white px-4 py-2 rounded-2xl w-fit">
            I have something special to ask…
          </div>
        </div>

        {/* 💖 Buttons */}
        {!accepted && (
          <div className="relative mt-8 h-28 flex items-center justify-center gap-6">
            {/* YES Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleYes}
              className="z-10 px-8 py-3 rounded-full bg-pink-600 text-white font-bold shadow-xl"
            >
              YES 💖
            </motion.button>

            {/* NO Button */}
            <motion.button
              animate={noPos}
              transition={{ type: "spring", stiffness: 120 }}
              onMouseEnter={moveNo}
              onTouchStart={moveNo}
              className="z-10 px-8 py-3 rounded-full bg-gray-200 font-bold shadow-lg"
              style={{
                transform: `translate(${noPos.x}px, ${noPos.y}px)`,
              }}
            >
              NO 🙈
            </motion.button>
          </div>
        )}

        {/* 🎆 Fireworks */}
        <AnimatePresence>
          {celebrate && (
            <motion.div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0, 1.6, 0],
                    x: Math.random() * 500 - 250,
                    y: Math.random() * 500 - 250,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                  className="absolute left-1/2 top-1/2 text-2xl"
                >
                  🎆
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 🎁 Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20">
            <motion.div
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm w-[90%]"
            >
              <div className="text-6xl mb-4">💍</div>
              <h2 className="text-3xl font-bold text-pink-600">
                She said YES! 🎉
              </h2>
              <p className="mt-3 text-gray-700">This moment is forever 💕</p>

              <button
                onClick={async () => {
                  await captureScreenshot();
                  setShowPopup(false);
                }}
                className="mt-6 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold"
              >
                Save Memory 📸
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
