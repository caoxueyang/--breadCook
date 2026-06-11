import { useState, useEffect } from 'react';
import splashGif from '../assets/huangbai/开机动画2.gif';
import './SplashScreen.css';

export default function SplashScreen({ children }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => setShow(false);

  if (!show) return children;

  return (
    <>
      <div className={`splash-screen ${show ? '' : 'splash-fade-out'}`}>
        <div className="splash-content">
          <h1 className="splash-title">欢迎光临~ 👋</h1>
          <p className="splash-subtitle">面包の餐厅</p>
          <img src={splashGif} alt="loading" className="splash-gif" />
        </div>
        <button className="splash-skip" onClick={handleSkip} aria-label="跳过开机动画">
          跳过 〉
        </button>
        <div className="splash-footer">曹雪洋包晓洁天下第一好</div>
      </div>
      {children}
    </>
  );
}
