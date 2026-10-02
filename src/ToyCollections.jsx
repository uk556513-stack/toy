import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import gsap from "gsap";

import "swiper/css";
import "swiper/css/effect-cards";
import "./ToyCollections.css";
const toysData = [
  { 
    id: 1, 
    name: "TEDDY BEAR", 
    price: "₹1,249", 
    image: "https://tse1.mm.bing.net/th/id/OIP.R9Ye6WvgvhGh2tCN4Zb3ZAHaJ4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" 
  },
  { 
    id: 2, 
    name: "WOODEN ROBOT", 
    price: "₹1,899", 
    image: "https://tse4.mm.bing.net/th/id/OIP.C5CFzdPoNCW3A0CjjZx09AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" 
  },
  { 
    id: 3, 
    name: "RACING CAR", 
    price: "₹2,499", 
    image: "https://tse3.mm.bing.net/th/id/OIP.M8uW93oa9KNjDuLU42S4wgHaHa?r=0&w=720&h=720&rs=1&pid=ImgDetMain&o=7&rm=3" 
  },
  { 
    id: 4, 
    name: "RUBBER DUCK", 
    price: "₹899", 
    image: "https://cdn.shoplightspeed.com/shops/605879/files/75009743/1024x1024x2/infantino-classic-rubber-duck.jpg" 
  },
  { 
    id: 5, 
    name: "LEGO BRICKS", 
    price: "₹3,299", 
    image: "https://tse2.mm.bing.net/th/id/OIP.icu3eU50YtXuqKHgiS5nkwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" 
  },
  { 
    id: 6, 
    name: "ACTION FIGURE", 
    price: "₹1,799", 
    image: "https://down-my.img.susercontent.com/file/sg-11134201-7rfex-m3bx5e2xuqale4" 
  },
  { 
    id: 7, 
    name: "PLUSH TOY", 
    price: "₹1,499", 
    image: "https://tse4.mm.bing.net/th/id/OIP.xLUksLQRgFtAJG6t-ODzHwHaHP?r=0&w=910&h=890&rs=1&pid=ImgDetMain&o=7&rm=3" 
  },
];

const fanSpread = [
  { x: -380, y: 15, rotY: -25, rotZ: -8 },
  { x: -250, y: 8, rotY: -18, rotZ: -5 },
  { x: -125, y: 2, rotY: -10, rotZ: -2 },
  { x: 0, y: 0, rotY: 0, rotZ: 0 },
  { x: 125, y: 2, rotY: 10, rotZ: 2 },
  { x: 250, y: 8, rotY: 18, rotZ: 5 },
  { x: 380, y: 15, rotY: 25, rotZ: 8 },
];

export default function ToyCollections() {
  const [view, setView] = useState("hero"); // 'hero', 'stack', 'carousel'
  const [cart, setCart] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const heroTextRef = useRef(null);
  const carouselHeaderRef = useRef(null);
  const collectionCardsRef = useRef([]);

  useEffect(() => {
    if (view === "hero" && heroTextRef.current) {
      gsap.fromTo(
        heroTextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    if (view === "carousel") {
      if (carouselHeaderRef.current) {
        gsap.fromTo(
          carouselHeaderRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      }

      const cards = collectionCardsRef.current;
      if (cards.length > 0) {
        gsap.set(cards, {
          x: 0,
          y: 0,
          rotationY: 180,
          rotationZ: 0,
          scale: 0.9,
          opacity: 1,
        });

        cards.forEach((card, i) => {
          const config = fanSpread[i] || { x: (i - 3) * 120, y: 0, rotY: 0, rotZ: 0 };

          gsap.to(card, {
            x: config.x,
            y: config.y,
            rotationY: config.rotY,
            rotationZ: config.rotZ,
            scale: 1,
            opacity: 1,
            duration: 1.3,
            delay: 0.8 + i * 0.05,
            ease: "back.out(1.2)",
          });
        });
      }
    }
  }, [view]);

  const addToCart = (toy) => {
    if (!cart.some((item) => item.id === toy.id)) {
      setCart([...cart, toy]);
    }
  };

  const clearCart = () => setCart([]);

  const handleBack = () => {
    if (view === "carousel") setView("stack");
    else if (view === "stack") setView("hero");
  };

  return (
    <div className="app-viewport">
      <header className="top-header">
        <div className="left-action">
          {view !== "hero" && (
            <button className="pill-btn back-btn" onClick={handleBack}>
              &lt; Back
            </button>
          )}
        </div>

        <div className="right-action">
          <button
            className="pill-btn cart-btn"
            onClick={() => setShowCartDropdown(!showCartDropdown)}
          >
            Cart <span className="cart-badge">{cart.length}</span>
          </button>

          {showCartDropdown && (
            <div className="cart-popover">
              {cart.length === 0 ? (
                <p className="empty-cart-text">Your cart is empty.</p>
              ) : (
                <div className="cart-details">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-row">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">{item.price}</span>
                    </div>
                  ))}
                  <div className="cart-row total-row">
                    <span>Total</span>
                    <span>
                      ₹
                      {cart
                        .reduce(
                          (acc, item) =>
                            acc + parseInt(item.price.replace(/[₹,]/g, "")),
                          0
                        )
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear cart
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* PAGE 1: HERO VIEW */}
      {view === "hero" && (
        <main className="screen-content center-content" ref={heroTextRef}>
          <p className="subtitle-italic">Seven toys, one magical store</p>
          <h1 className="main-title">Toy Collections</h1>
          <button className="primary-dark-btn" onClick={() => setView("stack")}>
            View toys
          </button>
        </main>
      )}

      {/* PAGE 2: SIDE-BY-SIDE SPLIT VIEW */}
      {view === "stack" && (
        <main className="screen-content stack-content">
          <div className="stack-container-split">
            <div className="swiper-wrapper-box">
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards, Autoplay]}
                autoplay={{ delay: 1400, disableOnInteraction: false }}
                className="stack-swiper"
                onSlideChange={(swiper) => {
                  setActiveIndex(swiper.activeIndex);
                  if (swiper.activeIndex === toysData.length - 1) {
                    setTimeout(() => setView("carousel"), 1200);
                  }
                }}
              >
                {toysData.map((toy) => (
                  <SwiperSlide key={toy.id} className="stack-card-slide">
                    <img src={toy.image} alt={toy.name} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="watch-meta-info-side">
              <h2 className="watch-title-italic">{toysData[activeIndex].name}</h2>
              <p className="watch-price">{toysData[activeIndex].price}</p>
              <button
                className="primary-dark-btn add-btn"
                onClick={() => addToCart(toysData[activeIndex])}
              >
                {cart.some((item) => item.id === toysData[activeIndex].id)
                  ? "Added ✓"
                  : "Add to cart"}
              </button>
              <p className="slide-counter">
                {activeIndex + 1} of {toysData.length}
              </p>
            </div>
          </div>
        </main>
      )}

      {/* PAGE 3: 3D FAN SPREAD */}
      {view === "carousel" && (
        <main className="screen-content carousel-content">
          <div className="carousel-header-box" ref={carouselHeaderRef}>
            <p className="subtitle-italic">The Ultimate</p>
            <h1 className="main-title">Toy Collections</h1>
          </div>

          <div className="collections-stage">
            {toysData.map((toy, index) => (
              <div
                key={toy.id}
                className="collection-card-item"
                ref={(el) => (collectionCardsRef.current[index] = el)}
                onClick={() => addToCart(toy)}
              >
                <div className="card-inner">
                  <img src={toy.image} alt={toy.name} />
                  <div className="card-caption">{toy.name}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}