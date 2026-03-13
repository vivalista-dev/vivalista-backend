import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f4ff] text-gray-800">

      {/* HEADER */}

      <header className="w-full border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

          <div className="flex items-center gap-2">
            <Image
              src="/logo-vivalista.png"
              alt="VivaLista"
              width={160}
              height={60}
            />
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#">Sobre</a>
            <a href="#">Como Funciona</a>
            <a href="#">Exemplos</a>
            <a href="#">Contato</a>
          </nav>

          <a
            href="/e/casamento-renan-e-laislla"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Criar meu evento
          </a>

        </div>
      </header>

      {/* HERO */}

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 p-10 items-center">

        <div>

          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 leading-tight">
            Celebre momentos especiais
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Crie sua página de evento, compartilhe com seus convidados
            e receba contribuições diretamente na sua conta.
          </p>

          <div className="flex gap-4 mt-6">

            <a
              href="/e/casamento-renan-e-laislla"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg"
            >
              Criar meu evento
            </a>

            <button className="bg-white border px-6 py-3 rounded-lg">
              Ver exemplos
            </button>

          </div>

        </div>

        <div className="flex justify-center">

          <Image
            src="/logo-vivalista.png"
            alt="VivaLista"
            width={300}
            height={300}
          />

        </div>

      </section>

      {/* TIPOS DE EVENTO */}

      <section className="max-w-6xl mx-auto p-10 text-center">

        <h2 className="text-3xl font-bold text-purple-900">
          Perfeito para qualquer celebração
        </h2>

        <div className="grid md:grid-cols-5 gap-6 mt-10">

          <div className="bg-white p-6 rounded-xl shadow">💍 Casamento</div>
          <div className="bg-white p-6 rounded-xl shadow">🎂 Aniversário</div>
          <div className="bg-white p-6 rounded-xl shadow">🍼 Chá de Bebê</div>
          <div className="bg-white p-6 rounded-xl shadow">🎓 Formatura</div>
          <div className="bg-white p-6 rounded-xl shadow">🏡 Casa Nova</div>

        </div>

      </section>

      {/* COMO FUNCIONA */}

      <section className="bg-white p-10">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center text-purple-900">
            Simples como deveria ser
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-10 text-center">

            <div>
              <h3 className="font-bold text-lg">1. Crie seu evento</h3>
              <p className="text-sm text-gray-500 mt-2">
                Escolha o modelo e personalize.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">2. Compartilhe</h3>
              <p className="text-sm text-gray-500 mt-2">
                Envie o link para convidados.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">3. Receba presentes</h3>
              <p className="text-sm text-gray-500 mt-2">
                Contribuições em dinheiro.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg">4. Dinheiro direto</h3>
              <p className="text-sm text-gray-500 mt-2">
                Sem burocracia.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-purple-700 text-white text-center p-6 mt-10">
        VivaLista © 2026
      </footer>

    </main>
  );
}