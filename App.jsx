import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const videos = [
  "/kingsman_002.mp4",
  "/taken_002.mp4",
  "/taken_003.mp4",
];

const captions = [
  "“I don't know who you are”",
  "“I'll be back”",
  "“Manners maketh man”",
  "“This is not that kind of movie”",
  "“Good luck”",
  "“I will find you, and I will kill you”",
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showPlayBtn, setShowPlayBtn] = useState(true);   // 버튼 보여줄지 여부
  const [videoReady, setVideoReady] = useState(false);    // 영상 시작여부

  const playBtnRef = useRef(null);
  const playIconRef = useRef(null);
  const videoRef = useRef(null);

  // GSAP: SVG 그려지는 애니메이션
  useEffect(() => {
    if (showPlayBtn && playIconRef.current) {
      gsap.set(playIconRef.current, { strokeDasharray: 180, strokeDashoffset: 180, opacity: 1 });
      gsap.to(playIconRef.current, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power1.inOut"
      });
    }
  }, [showPlayBtn]);

  // 클릭 시 애니메이션(커지면서 사라짐)+영상 준비
  const handlePlayClick = () => {
    if (playBtnRef.current) {
      gsap.to(playBtnRef.current, {
        scale: 2.2,
        opacity: 0,
        duration: 2.5,
        ease: "power2.in",
        onComplete: () => {
          setShowPlayBtn(false);
          setTimeout(() => setVideoReady(true), 200); // 자연스러운 딜레이 후 영상 시작
        }
      });
    }
  };

  useEffect(() => {
    if (videoReady && videoRef.current) {
      // autoplay + 소리 ON
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  }, [videoReady, index]);

  useEffect(() => {
    if (showFinalMessage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFinalMessage]);

  const handleEnded = () => {
    if (index < videos.length - 1) {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => prev + 1);
        setFade(true);
      }, 300);
    } else {
      setShowFinalMessage(true);
    }
  };

  return (
    <div className="theme-bg">
      {/* ─── 인트로 재생버튼 GSAP 애니메이션 (클릭 필요) ─── */}
      {showPlayBtn && (
        <div className="intro-play-center">
          <button
            className="play-btn-anim"
            ref={playBtnRef}
            tabIndex={0}
            aria-label="영상 재생"
            onClick={handlePlayClick}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="58"
                stroke="#2dff8c" strokeWidth="4"
                fill="rgba(0,0,0,0.12)"
              />
              <polyline
                ref={playIconRef}
                points="50,45 50,75 78,60 50,45"
                fill="none"
                stroke="#39ff14"
                strokeWidth="7"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0 0 14px #39ff14cc)"
                }}
              />
            </svg>
          </button>
        </div>
      )}

      {/* ─── 영상/자막 시퀀스 (영상+자막, 소리 O) ─── */}
      {videoReady && !showFinalMessage && index < videos.length && (
        <>
          <video
            ref={videoRef}
            key={videos[index]}
            src={videos[index]}
            autoPlay
            onEnded={handleEnded}
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.3s",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "fixed",
              bottom: "10%",
              width: "100vw",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: '2rem',
                textShadow: '0 2px 8px #000',
                pointerEvents: 'auto',
                display: 'block',
                textAlign: 'center',
              }}
            >
              {captions[index]}
            </span>
          </div>
        </>
      )}

      {/* ─── 영상 끝 메시지 ─── */}
      {showFinalMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              color: "#39ff14",
              fontSize: "2.5rem",
              fontWeight: "bold",
              textShadow:
                "0 0 8px #39ff14, 0 0 24px #39ff14, 0 0 48px #39ff14",
              background: "rgba(0,0,0,0.7)",
              padding: "2rem 3rem",
              borderRadius: "2rem",
              animation:
                "growTextBig 2s cubic-bezier(0.23,1.01,0.32,1) forwards",
              display: "block",
              whiteSpace: "nowrap",
              textAlign: "center",
              margin: 0,
            }}
          >
            Now it&apos;s your turn
          </span>
          <span
            style={{
              marginTop: "2rem",
              width: 56,
              height: 56,
              background: "#fff",
              borderRadius: "50%",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="9"
                y="2"
                width="6"
                height="12"
                rx="3"
                fill="#fff"
                stroke="#222"
              />
              <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
              <line x1="12" y1="22" x2="12" y2="18" />
            </svg>
          </span>
        </div>
      )}

      <style>{`
        .theme-bg {
          min-height: 100vh;
          background: linear-gradient(140deg,#001210 55%,#122a17 100%);
          position:relative;
        }
        .intro-play-center {
          width:100vw;height:100vh;
          position:fixed;left:0;top:0;z-index:30;
          display:flex;align-items:center;justify-content:center;
          background:rgba(0,0,0,0.98);
        }
        .play-btn-anim {
          width:160px;height:160px;
          background:radial-gradient(circle at 55% 45%, #101c13 74%, #022f18 100%);
          border-radius:50%;display:flex;align-items:center;justify-content:center;
          box-shadow:0 8px 32px #1dff8165, 0 1px 4px #001a13;
          filter:drop-shadow(0 0 24px #2dff8c30);
          transform:scale(1); opacity:1; transition: all .35s;
        }
        @media (max-width: 950px) {
          .play-btn-anim{width:98px;height:98px;}
        }
        @keyframes growTextBig {
          0% {
            transform: scale(0.3);
            font-size: 2.5rem;
            opacity: 0.2;
          }
          100% {
            transform: scale(1.2);
            font-size: 7vw;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
