import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        padding: 20,
      }}
    >
      <header
        style={{
          borderBottom: "1px solid #eee",
          paddingBottom: 12,
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>My Daily Cards</h1>
      </header>
      <main>
        <h2>Hello, world!</h2>
        <p>
          This is a minimal Vite + React app. Later you'll add Google SSO and
          the cards UI here.
        </p>
      </main>
    </div>
  );
}

export default App;
