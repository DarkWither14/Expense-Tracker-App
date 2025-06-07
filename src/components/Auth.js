import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { LocaleContext } from "../contexts/LocaleContext";
import "./Auth.css";

const Auth = () => {
  const { login, register } = useContext(AuthContext);
  const { t } = useContext(LocaleContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      if (!window.PublicKeyCredential) {
        throw new Error("Biometric authentication is not supported on this device");
      }
      
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: "required",
        }
      });

      if (credential) {
        // Here you would typically verify the credential with your backend
        await login(email, "biometric");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? t('login') : t('register')}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            {isLogin ? t('login') : t('register')}
          </button>
        </form>
        <div className="auth-options">
          <button
            className="switch-mode"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? t('needAccount') : t('haveAccount')}
          </button>
          {isLogin && (
            <button
              className="biometric-login"
              onClick={handleBiometricLogin}
            >
              {t('loginWithBiometrics')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth; 