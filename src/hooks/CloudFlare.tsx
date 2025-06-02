import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: any;
  }
}

const TurnstileForm: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const Cloudflare_Key = import.meta.env.VITE_CLOUDFLARE_KEY; // your real sitekey
  useEffect(() => {
    const loadTurnstileScript = () => {
      if (document.getElementById("turnstile-script") || verified) return;

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.defer = true;
      script.async = true;
      script.id = "turnstile-script";
      script.onload = () => {
        if (widgetRef.current && window.turnstile && !verified) {
          window.turnstile.render(widgetRef.current, {
            sitekey: Cloudflare_Key, // your real sitekey
            callback: (token: string) => {
              console.log(`Challenge Success: ${token}`);
              setToken(token);
              setVerified(true);
            },
          });
        }
      };

      document.body.appendChild(script);
    };

    loadTurnstileScript();
  });

  return (
    <>
      <form className="p-4 text-white space-y-4 max-w-md mx-auto">
        {!verified ? (
          <div ref={widgetRef} id="example-container" />
        ) : (
          <p className="text-green-500">Verification successful!</p>
        )}
      </form>
    </>
  );
};

export default TurnstileForm;
