import React, { useEffect, useRef } from "react";
import { useAuth } from "../state/auth";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  const { signIn } = useAuth();
  const btnRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    // load GIS script
    const scriptId = "google-identity";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.id = scriptId;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      s.onload = initGis;
    } else {
      initGis();
    }

    function initGis() {
      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
      )
        return;

      // initialize the client
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "popup",
      });

      // render the button
      window.google.accounts.id.renderButton(
        btnRef.current,
        { theme: "outline", size: "large", text: "signin_with" }, // customization
      );

      // optionally prompt (auto one-tap) — disabled here for clarity
      // window.google.accounts.id.prompt();
    }

    // credential response handler
    function handleCredentialResponse(response) {
      // response.credential is the ID token (JWT)
      // decode basic profile from the JWT payload client-side for demo
      try {
        const payload = parseJwt(response.credential);
        const userInfo = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        };
        signIn(userInfo);
      } catch (e) {
        console.error("Failed to parse credential", e);
      }
    }

    // cleanup not strictly necessary
    return () => {};
  }, [signIn]);
  // simple JWT parse (no verification)
  function parseJwt(token) {
    const b64 = token.split(".")[1];
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(json);
  }

  // manual demo sign-in (fallback for dev)
  function demoSignIn() {
    signIn({
      id: "demo",
      name: "Demo User",
      email: "demo@example.com",
      picture: "",
    });
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto',
      }}
    >
      <h1>stsair — Sign in</h1>
      <p>Sign in with Google to access your dashboard.</p>

      <div ref={btnRef} />

      {!CLIENT_ID && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: "#555" }}>
            No VITE_GOOGLE_CLIENT_ID set. Use the demo sign-in for local
            testing.
          </p>
          <button onClick={demoSignIn} style={{ padding: "8px 12px" }}>
            Sign in (demo)
          </button>
        </div>
      )}
    </div>
  );
}
