"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        alert("Login inválido");
        return;
      }

      const data = await response.json();

      const token =
        data.access_token ||
        data.accessToken ||
        data.token;

      if (!token) {
        alert("Token não encontrado na resposta do servidor.");
        console.log(data);
        return;
      }

      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer login.");
    }
  }

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "Arial",
        maxWidth: 400,
        margin: "auto",
      }}
    >
      <h1>Login VivaLista</h1>

      <div style={{ marginTop: 20 }}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 8 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginTop: 8 }}
        />
      </div>

      <button
        onClick={handleLogin}
        style={{
          marginTop: 30,
          padding: 12,
          width: "100%",
          background: "black",
          color: "white",
          border: "none",
        }}
      >
        Entrar
      </button>
    </main>
  );
}