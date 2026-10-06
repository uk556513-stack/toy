import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import "./App.css";

// Unga products-ah inga maathikalam (name, price, image -> public/images/)
const PRODUCTS = [
  {
    id: 1,
    name: "Eternal Solitaire",
    price: 32549,
    image: "./images/p1-ring.webp",
  },
  {
    id: 2,
    name: "Royal Emerald",
    price: 48999,
    image: "./images/p2-necklace.webp",
  },
  {
    id: 3,
    name: "Heritage Kundan",
    price: 38749,
    image: "./images/p3-kundan.webp",
  },
  {
    id: 4,
    name: "Nova Crystal",
    price: 14849,
    image: "./images/p4-jhumka.webp",
  },
  {
    id: 5,
    name: "Zenith Dark",
    price: 21549,
    image: "./images/p5-bangles.webp",
  },
  {
    id: 6,
    name: "Lumina Gold",
    price: 24949,
    image: "./images/p6-bracelet.webp",
  },
  {
    id: 7,
    name: "Stellar Ultra",
    price: 26549,
    image: "./images/p7-rings.webp",
  },
];

const inr = (n) => "₹" + n.toLocaleString("en-IN");

const spring = {
  type: "spring",
  stiffness: 110,
  damping: 18,
  mass: 0.9,
};

/* ---------------- Phase 1 : Intro deck ---------------- */

function IntroDeck({ onDone }) {
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (top < PRODUCTS.length - 1) {
      const t = setTimeout(
        () => setTop((v) => v + 1),
        top === 0 ? 900 : 260
      );

      return () => clearTimeout(t);
    }

    const t = setTimeout(onDone, 500);

    return () => clearTimeout(t);
  }, [top, onDone]);

  const p = PRODUCTS[top];

  return (
    <motion.div
      className="intro"
      exit={{
        opacity: 0,
        scale: 0.55,
        y: 60,
      }}
      transition={{
        duration: 0.6,
        ease: [0.7, 0, 0.3, 1],
      }}
    >
      <p className="intro-kicker">
        Signature Jewellery · 2026
      </p>

      <div className="intro-deck">
        <div className="intro-ghost g2" />
        <div className="intro-ghost g1" />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={p.id}
            className="intro-card"
            initial={{
              y: 30,
              opacity: 0,
              rotate: 4,
            }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: 0,
            }}
            exit={{
              x: -40,
              opacity: 0,
              rotate: -6,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <img
              src={p.image}
              alt={p.name}
            />

            <div className="intro-caption">
              <span>{p.name}</span>
              <small>{inr(p.price)}</small>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="intro-dots">
        {PRODUCTS.map((x, i) => (
          <i
            key={x.id}
            className={i === top ? "on" : ""}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- Phase 2 : Spread row ---------------- */

function Spread({
  selectedId,
  onPick,
  collapsed,
}) {
  const mid = (PRODUCTS.length - 1) / 2;

  return (
    <section className="spread">
      <div className="spread-header">
        <motion.p
          className="spread-sub"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
        >
          The Ultimate
        </motion.p>

        <motion.h1
          className="spread-title"
          initial={{
            opacity: 0,
            y: 20,
            letterSpacing: "12px",
          }}
          animate={{
            opacity: 1,
            y: 0,
            letterSpacing: "-1px",
          }}
          transition={{
            duration: 0.9,
            ease: [0.2, 0.8, 0.2, 1],
          }}
        >
          Collections
        </motion.h1>
      </div>

      <div className="row">
        {PRODUCTS.map((p, i) => {
          const o = i - mid;
          const hidden = selectedId === p.id;

          if (hidden) return null;

          return (
            <motion.div
              key={p.id}
              className="slot"
              initial={{
                x: 0,
                y: 0,
                rotate: 0,
                scale: 0.5,
              }}
              animate={
                collapsed
                  ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 0.5,
                    }
                  : {
                      x: `${o * 98}%`,
                      y:
                        Math.abs(o) *
                        Math.abs(o) *
                        7,
                      rotate: o * 7,
                      scale: 1,
                    }
              }
              transition={{
                ...spring,
                delay: collapsed
                  ? 0
                  : 0.25 +
                    Math.abs(o) * 0.06,
              }}
              style={{
                zIndex:
                  10 -
                  Math.abs(Math.round(o)),
              }}
            >
              <motion.button
                layoutId={`card-${p.id}`}
                className="tile"
                onClick={() => onPick(i)}
                whileHover={{
                  y: -18,
                  scale: 1.06,
                  rotate: -o * 7,
                }}
                transition={spring}
              >
                <motion.img
                  layoutId={`img-${p.id}`}
                  src={p.image}
                  alt={p.name}
                  draggable="false"
                />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="spread-hint"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: collapsed ? 0 : 0.75,
        }}
        transition={{
          delay: 1,
        }}
      >
        Select a piece to view details · Scroll to browse
      </motion.p>
    </section>
  );
}

/* ---------------- Phase 3 : Detail ---------------- */

function Detail({
  index,
  setIndex,
  onBack,
  cart,
  addToCart,
}) {
  const p = PRODUCTS[index];
  const n = PRODUCTS.length;

  const next1 =
    PRODUCTS[(index + 1) % n];

  const next2 =
    PRODUCTS[(index + 2) % n];

  const lock = useRef(false);

  const [dir, setDir] = useState(1);

  const go = useCallback(
    (d) => {
      if (lock.current) return;

      lock.current = true;

      setDir(d);

      setIndex(
        (i) => (i + d + n) % n
      );

      setTimeout(() => {
        lock.current = false;
      }, 650);
    },
    [n, setIndex]
  );

  /*
    RIGHT → LEFT SCROLL

    Scroll Down:
    Current card → LEFT
    Next card → RIGHT to LEFT

    Scroll Up:
    Reverse direction
  */
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();

      if (Math.abs(e.deltaY) <= 18) {
        return;
      }

      if (e.deltaY > 0) {
        // RIGHT → LEFT
        go(1);
      } else {
        // LEFT → RIGHT
        go(-1);
      }
    };

    const onKey = (e) => {
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown"
      ) {
        go(1);
      }

      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp"
      ) {
        go(-1);
      }

      if (e.key === "Escape") {
        onBack();
      }
    };

    window.addEventListener(
      "wheel",
      onWheel,
      {
        passive: false,
      }
    );

    window.addEventListener(
      "keydown",
      onKey
    );

    return () => {
      window.removeEventListener(
        "wheel",
        onWheel
      );

      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, [go, onBack]);

  const added = cart.includes(p.id);

  return (
    <motion.section
      className="detail"
      initial={{
        opacity: 1,
      }}
      exit={{
        opacity: 1,
      }}
    >
      {/* BACK BUTTON */}

      <motion.button
        className="back-btn"
        onClick={onBack}
        initial={{
          opacity: 0,
          x: -10,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          delay: 0.3,
        }}
      >
        ← Back
      </motion.button>

      {/* PRODUCT STACK */}

      <div className="stack">

        {/* BACK CARD 2 */}

        <motion.div
          className="stack-card back b2"
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            x: 30,
            y: 14,
            rotate: 3,
            opacity: 1,
          }}
          exit={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
          }}
          transition={{
            ...spring,
            delay: 0.2,
          }}
          onClick={() => go(1)}
        >
          <img
            src={next2.image}
            alt=""
          />
        </motion.div>

        {/* BACK CARD 1 */}

        <motion.div
          className="stack-card back b1"
          initial={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            x: 15,
            y: 7,
            rotate: 1.5,
            opacity: 1,
          }}
          exit={{
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 0,
          }}
          transition={{
            ...spring,
            delay: 0.12,
          }}
          onClick={() => go(1)}
        >
          <img
            src={next1.image}
            alt=""
          />
        </motion.div>

        {/* FRONT CARD */}

        <AnimatePresence
          initial={false}
          custom={dir}
          mode="popLayout"
        >
          <motion.div
            key={p.id}
            layoutId={`card-${p.id}`}
            className="stack-card front"
            custom={dir}
            variants={{
              /*
                NEXT PRODUCT:
                RIGHT → LEFT
              */

              enter: (d) => ({
                x:
                  d > 0
                    ? 320
                    : -320,

                y: 0,

                rotate:
                  d > 0
                    ? 8
                    : -8,

                opacity: 0,
              }),

              center: {
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
              },

              /*
                CURRENT PRODUCT:
                MOVES LEFT
              */

              leave: (d) => ({
                x:
                  d > 0
                    ? -320
                    : 320,

                y: 0,

                rotate:
                  d > 0
                    ? -8
                    : 8,

                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="leave"
            transition={spring}
            drag="x"
            dragConstraints={{
              left: 0,
              right: 0,
            }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) {
                // Swipe left = next
                go(1);
              } else if (
                info.offset.x > 80
              ) {
                // Swipe right = previous
                go(-1);
              }
            }}
          >
            <motion.img
              layoutId={`img-${p.id}`}
              src={p.image}
              alt={p.name}
              draggable="false"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PRODUCT INFORMATION */}

      <div className="info">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            className="info-inner"
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -14,
            }}
            transition={{
              duration: 0.3,
              delay: 0.1,
            }}
          >
            <h2 className="product-name">
              {p.name}
            </h2>

            <p className="product-price">
              {inr(p.price)}
            </p>

            <motion.button
              className={`cart-btn ${
                added ? "added" : ""
              }`}
              onClick={() =>
                addToCart(p.id)
              }
              whileHover={{
                y: -2,
                boxShadow:
                  "0 10px 24px rgba(0,0,0,.25)",
              }}
              whileTap={{
                scale: 0.96,
              }}
            >
              {added
                ? "✓ Added to Cart"
                : "ADD TO CART"}

              {!added && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="9"
                    cy="21"
                    r="1"
                  />

                  <circle
                    cx="20"
                    cy="21"
                    r="1"
                  />

                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  const [phase, setPhase] =
    useState("intro");

  const [collapsed, setCollapsed] =
    useState(true);

  const [index, setIndex] =
    useState(null);

  const [cart, setCart] =
    useState([]);

  const finishIntro =
    useCallback(
      () => setPhase("spread"),
      []
    );

  useEffect(() => {
    if (phase !== "spread") {
      return;
    }

    const t = setTimeout(
      () => setCollapsed(false),
      700
    );

    return () => clearTimeout(t);
  }, [phase]);

  const addToCart = (id) => {
    setCart((c) =>
      c.includes(id)
        ? c
        : [...c, id]
    );
  };

  const selected =
    index !== null
      ? PRODUCTS[index]
      : null;

  return (
    <main className="stage">

      <LayoutGroup>

        {/* INTRO */}

        <AnimatePresence>
          {phase === "intro" && (
            <IntroDeck
              key="intro"
              onDone={finishIntro}
            />
          )}
        </AnimatePresence>

        {/* COLLECTION */}

        {phase === "spread" && (
          <motion.div
            className="spread-wrap"
            animate={{
              opacity: selected
                ? 0
                : 1,
            }}
            transition={{
              duration: 0.35,
              delay: selected
                ? 0
                : 0.2,
            }}
            style={{
              pointerEvents: selected
                ? "none"
                : "auto",
            }}
          >
            <Spread
              selectedId={
                selected?.id
              }
              onPick={setIndex}
              collapsed={collapsed}
            />
          </motion.div>
        )}

        {/* DETAIL */}

        <AnimatePresence>
          {selected && (
            <Detail
              key="detail"
              index={index}
              setIndex={setIndex}
              onBack={() =>
                setIndex(null)
              }
              cart={cart}
              addToCart={addToCart}
            />
          )}
        </AnimatePresence>

      </LayoutGroup>

      {/* CART */}

      {cart.length > 0 && (
        <motion.div
          className="cart-badge"
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
        >
          Cart · {cart.length}
        </motion.div>
      )}

    </main>
  );
}