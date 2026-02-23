import React, { useEffect, useState } from "react";
import { useAuth } from "../state/auth";

const STORAGE_KEY = "stsair_cards_v1";

function loadCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : [
          { id: "1", title: "Welcome", body: "This is your first card." },
          { id: "2", title: "Tip", body: "Add and remove cards as you like." },
        ];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [cards, setCards] = useState(loadCards);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {}
  }, [cards]);

  function addCard(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const newCard = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
    };
    setCards([newCard, ...cards]);
    setTitle("");
    setBody("");
  }

  function removeCard(id) {
    setCards(cards.filter((c) => c.id !== id));
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto',
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <div style={{ color: "#555" }}>
            {user?.name} — {user?.email}
          </div>
        </div>
        <div>
          <button onClick={signOut} style={{ padding: "8px 12px" }}>
            Sign out
          </button>
        </div>
      </header>

      <section style={{ marginTop: 20 }}>
        <form
          onSubmit={addCard}
          style={{ display: "flex", gap: 8, marginBottom: 16 }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: 8, flex: "0 0 200px" }}
          />
          <input
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ padding: 8, flex: 1 }}
          />
          <button type="submit" style={{ padding: "8px 12px" }}>
            Add
          </button>
        </form>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                background: "white",
                borderRadius: 8,
                padding: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{card.title}</h3>
              <p style={{ marginBottom: 8 }}>{card.body}</p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => removeCard(card.id)}
                  style={{
                    background: "#fee2e2",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
