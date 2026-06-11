import { useState, useEffect } from 'react';
import splashGif from '../assets/huangbai/开机动画2.gif';
import './SplashScreen.css';

export default function SplashScreen({ children }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return children;

  return (
    <>
      <div className={`splash-screen ${show ? '' : 'splash-fade-out'}`}>
        <div className="splash-content">
          <h1 className="splash-title">Hello 👋</h1>
          <p className="splash-subtitle">面包の餐厅</p>
          <img src={splashGif} alt="loading" className="splash-gif" />
        </div>
      </div>
      {children}
    </>
  );
}
