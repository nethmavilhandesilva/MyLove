import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Activity, Clock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- PERSONALIZED DATA ---
const MEMORY_DATA = [
  { url: "/photo1.jpeg", title: "The First Spark", words: "In your eyes, I found a universe I never knew existed." },
  { url: "/photo2.jpeg", title: "The Anchor", words: "You are the gravity that keeps my world from drifting away." },
  { url: "/photo3.jpeg", title: "The Peace", words: "Your smile is the only language my heart needs to understand." },
  { url: "/photo4.jpeg", title: "The Flame", words: "Every moment with you is a flame that warms my soul." },
  { url: "/photo5.jpeg", title: "The Forever", words: "I didn't just fall in love with you; I came home to you." },
];

const LETTER_TEXT = "To my most beautiful soul... Since the moment you entered my life, every line of code, every breath, and every heartbeat has been dedicated to you. You aren't just a part of my world; you ARE my world. This digital universe is a small shadow of the love I carry for you. Forever isn't long enough, but I'll start there. I love you, more and more in every passing a day mage chooty doni...";

const anniversary = new Date("2025-12-11T00:00:00");

const App = () => {
  const [phase, setPhase] = useState('sync'); // sync -> portal -> cinematic -> letter
  const [syncProgress, setSyncProgress] = useState(0);
  const [daysTogether, setDaysTogether] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const audioRef = useRef(null);
  const syncInterval = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const timer = setInterval(() => {
      const diff = new Date() - anniversary;
      setDaysTogether(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, 1000);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);

  const startSync = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play pending sync..."));
    }
    if (syncInterval.current) clearInterval(syncInterval.current);
    syncInterval.current = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(syncInterval.current);
          handlePortalTransition();
          return 100;
        }
        return prev + 1;
      });
    }, 30);
  };

  const handlePortalTransition = () => {
    setPhase('portal');
    if (audioRef.current) audioRef.current.play();
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 },
      colors: ['#ff0055', '#ffffff']
    });
    setTimeout(() => { setPhase('cinematic'); }, 2500);
  };

  const stopSync = () => {
    if (syncProgress < 100) {
      clearInterval(syncInterval.current);
      setSyncProgress(0);
    }
  };

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />

      <AnimatePresence mode="wait">
        {phase === 'sync' && (
          <motion.div 
            key="sync" 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} 
            transition={{ duration: 0.8 }}
            style={styles.screen}
          >
            <div style={styles.authBox}>
              <Activity size={40} color="#ff0055" />
              <h1 style={styles.glitchTitle}>SOUL CONNECTION</h1>
              <p style={styles.authSub}>Hold the heart to synchronize our heartbeats and unlock our song.</p>
              <div style={styles.scannerWrapper}>
                <motion.div 
                  onMouseDown={startSync} 
                  onTouchStart={startSync}
                  onMouseUp={stopSync} 
                  onTouchEnd={stopSync}
                  style={styles.fingerprint}
                >
                  <Heart size={50} fill={syncProgress > 5 ? "#ff0055" : "transparent"} color="#ff0055" />
                  <svg style={styles.svgRing}>
                    <circle cx="50" cy="50" r="45" stroke="#222" strokeWidth="2" fill="none" />
                    <motion.circle 
                      cx="50" cy="50" r="45" stroke="#ff0055" strokeWidth="4" fill="none"
                      strokeDasharray="283"
                      animate={{ strokeDashoffset: 283 - (283 * syncProgress) / 100 }}
                    />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'portal' && (
          <motion.div 
            key="portal" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1 }}
            style={styles.portalScreen}
          >
            <motion.div 
              animate={{ scale: [1, 25], opacity: [1, 0] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              style={styles.portalCircle}
            />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.portalText}>
              <Zap size={40} color="#ff0055" />
              <h2 style={{ letterSpacing: '10px', marginTop: '20px', fontSize: '1.5rem' }}>ENTERING OUR DIMENSION</h2>
              <p style={{ color: '#888', marginTop: '15px', fontSize: '0.8rem', letterSpacing: '3px' }}>INITIALIZING MEMORY ARCHIVE...</p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'cinematic' && (
          <motion.div key="cinema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.universe}>
            <StarField />
            <div style={styles.topBar}>
              <Clock size={16} color="#ff0055" />
              <span>{daysTogether} DAYS OF US</span>
            </div>

            <header style={styles.hero}>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={isMobile ? styles.mainTitleMobile : styles.mainTitle}
              >
                OUR LEGACY
              </motion.h1>
              <p style={styles.heroScrollHint}>SCROLL THROUGH OUR ETERNITY</p>
            </header>

            <div style={styles.gallery}>
              {MEMORY_DATA.map((item, i) => (
                <ParallaxPhoto key={i} data={item} index={i} isMobile={isMobile} />
              ))}
            </div>

            <div style={styles.letterTrigger}>
              <button onClick={() => setPhase('letter')} style={styles.finalButton}>READ MY VOWS</button>
            </div>
          </motion.div>
        )}

        {phase === 'letter' && (
          <motion.div key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.screen}>
             <StarField />
             <div style={{...styles.letterBox, width: isMobile ? '90%' : '800px', padding: isMobile ? '30px' : '70px'}}>
                <AutoTypingLetter text={LETTER_TEXT} isMobile={isMobile} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const ParallaxPhoto = ({ data, index, isMobile }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: false, amount: 0.2 }} 
    transition={{ duration: 0.8 }} 
    style={isMobile ? styles.photoNodeMobile : styles.photoNode}
  >
    <div style={{
      ...styles.parallaxContainer, 
      flexDirection: isMobile ? 'column' : (index % 2 === 0 ? 'row' : 'row-reverse'),
      gap: isMobile ? '20px' : '80px'
    }}>
      <motion.div 
        whileHover={isMobile ? {} : { scale: 1.05, rotateY: index % 2 === 0 ? 10 : -10 }} 
        style={isMobile ? styles.imageCardMobile : styles.imageCard}
      >
        <img src={data.url} alt="Memory" style={{
          ...styles.image, 
          objectFit: isMobile ? 'contain' : 'cover',
          background: isMobile ? '#0a0a0a' : 'transparent'
        }} />
        {!isMobile && <div style={styles.imgOverlay} />}
      </motion.div>
      <div style={{
        ...styles.photoInfo, 
        textAlign: isMobile ? 'center' : (index % 2 === 0 ? 'left' : 'right'),
        padding: isMobile ? '0 10px' : '0'
      }}>
        <span style={isMobile ? styles.photoIndexMobile : styles.photoIndex}>0{index + 1}</span>
        <h2 style={isMobile ? styles.photoTitleMobile : styles.photoTitle}>{data.title}</h2>
        <p style={isMobile ? styles.photoWordsMobile : styles.photoWords}>"{data.words}"</p>
      </div>
    </div>
  </motion.div>
);

const AutoTypingLetter = ({ text, isMobile }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => { setDisplayedText(text.slice(0, i)); i++; if (i > text.length) clearInterval(interval); }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div style={styles.typewriterContainer}>
      <Sparkles size={32} color="#ff0055" style={{ marginBottom: '25px' }} />
      <p style={{...styles.typewriterText, fontSize: isMobile ? '18px' : '26px'}}>{displayedText}<span>|</span></p>
      {displayedText.length === text.length && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '50px' }}>
          <Heart size={50} fill="#ff0055" color="#ff0055" />
          <p style={{ fontSize: '12px', marginTop: '15px', letterSpacing: '6px' }}>FOREVER YOURS</p>
        </motion.div>
      )}
    </div>
  );
};

const StarField = () => (
  <div style={styles.starLayer}>
    {[...Array(60)].map((_, i) => (
      <div key={i} style={{ 
        position: 'absolute', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, 
        width: '2px', height: '2px', background: '#fff', borderRadius: '50%', 
        opacity: Math.random(), animation: `pulse ${Math.random() * 3 + 2}s infinite` 
      }} />
    ))}
  </div>
);

// --- STYLES ---
const styles = {
  container: { background: '#000', color: '#fff', minHeight: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' },
  screen: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' },
  portalScreen: { height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#000', zIndex: 1000, overflow: 'hidden' },
  portalCircle: { width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, #ff0055 0%, transparent 70%)', position: 'absolute' },
  portalText: { zIndex: 1001, textAlign: 'center', textTransform: 'uppercase' },
  topBar: { position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', letterSpacing: '4px', color: '#ff0055', zIndex: 100, fontWeight: 'bold', width: 'max-content' },
  authBox: { maxWidth: '400px' },
  glitchTitle: { fontSize: '14px', letterSpacing: '8px', color: '#ff0055', margin: '25px 0' },
  authSub: { fontSize: '11px', color: '#666', lineHeight: '1.8', marginBottom: '45px' },
  scannerWrapper: { display: 'flex', justifyContent: 'center' },
  fingerprint: { width: '100px', height: '100px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' },
  svgRing: { position: 'absolute', width: '100px', height: '100px', transform: 'rotate(-90deg)' },
  universe: { position: 'relative' },
  starLayer: { position: 'fixed', inset: 0, zIndex: -1, background: 'radial-gradient(circle at center, #1a0208 0%, #000 100%)' },
  hero: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontSize: '10vw', fontWeight: '900', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  mainTitleMobile: { fontSize: '14vw', fontWeight: '900', color: '#fff', textTransform: 'uppercase', textAlign: 'center' },
  heroScrollHint: { fontSize: '10px', letterSpacing: '5px', color: '#ff0055', marginTop: '30px' },
  gallery: { padding: '0 8%' },
  photoNode: { height: '110vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  photoNodeMobile: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '80px' },
  parallaxContainer: { display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1100px' },
  imageCard: { flex: 1, height: '600px', borderRadius: '30px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', position: 'relative' },
  imageCardMobile: { width: '100%', height: 'auto', maxHeight: '450px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' },
  image: { width: '100%', height: '100%' },
  imgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' },
  photoInfo: { flex: 0.8 },
  photoIndex: { fontSize: '80px', fontWeight: '900', opacity: 0.05, display: 'block', marginBottom: '-20px' },
  photoIndexMobile: { fontSize: '40px', fontWeight: '900', opacity: 0.1, display: 'block' },
  photoTitle: { fontSize: '48px', marginBottom: '25px', color: '#ff0055', fontWeight: '800' },
  photoTitleMobile: { fontSize: '28px', marginBottom: '15px', color: '#ff0055', fontWeight: '800' },
  photoWords: { fontSize: '24px', lineHeight: '1.7', color: '#ddd', fontStyle: 'italic' },
  photoWordsMobile: { fontSize: '18px', lineHeight: '1.6', color: '#bbb', fontStyle: 'italic' },
  letterTrigger: { height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  finalButton: { background: 'none', border: '2px solid #ff0055', color: '#ff0055', padding: '18px 40px', borderRadius: '60px', cursor: 'pointer', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase' },
  letterBox: { background: 'rgba(255,255,255,0.03)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(30px)' },
  typewriterText: { lineHeight: '1.8', color: '#f0f0f0', fontStyle: 'italic' }
};

export default App;