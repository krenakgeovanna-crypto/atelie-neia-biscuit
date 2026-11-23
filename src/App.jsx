import { useEffect, useMemo, useRef, useState } from "react";
import { LINKS, CATEGORIES, PRODUCTS, FAQ } from "./data/products.js";

const go = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Icon({ name, size = 22, strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    truck: <><path d="M3 6h11v12H3z" /><path d="M14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /><path d="m9 12 2 2 4-4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />,
    search: <><circle cx="10.8" cy="10.8" r="7.3" /><path d="m16.2 16.2 4.3 4.3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    cart: <><path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 8H6" /><circle cx="10" cy="21" r="1" /><circle cx="18" cy="21" r="1" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    flower: <><path d="M12 12c-2.5-1.5-4.5-3.5-3.5-5.5S12 5 12 8c0-3 2.5-3.5 3.5-1.5S14.5 10.5 12 12z" /><path d="M12 12c1.5-2.5 3.5-4.5 5.5-3.5S19 12 16 12c3 0 3.5 2.5 1.5 3.5S13.5 14.5 12 12z" /><path d="M12 12c2.5 1.5 4.5 3.5 3.5 5.5S12 19 12 16c0 3-2.5 3.5-3.5 1.5S9.5 13.5 12 12z" /><path d="M12 12c-1.5 2.5-3.5 3.5-5.5 3.5S5 12 8 12c-3 0-3.5-2.5-1.5-3.5S10.5 9.5 12 12z" /><circle cx="12" cy="12" r="1.7" /></>,
    diamond: <><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M8 3l-2 6 6 12 6-12-2-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
  };

  return <svg {...common}>{paths[name] || paths.flower}</svg>;
}

function Photo({ p }) {
  return p.image ? (
    <img src={p.image} alt={p.name} loading="lazy" />
  ) : (
    <div className="ph" role="img" aria-label={`Espaço da foto de ${p.name}`}>
      <Icon name="flower" size={48} />
      <small>Foto {String(p.id).padStart(2, "0")}</small>
    </div>
  );
}

function Card({ p, onOpen, onAdd, small }) {
  return (
    <article className={"card" + (small ? " small" : "")}>
      <button className="card-img" onClick={() => onOpen(p)} aria-label={`Ver ${p.name}`}>
        <Photo p={p} />
        {p.isNew && <em className="tag">Novo</em>}
      </button>

      <div className="card-body">
        <h3>{p.name}</h3>
        <strong className="price">Preço negociável</strong>

        <div className="card-actions">
          <button className="btn ghost" onClick={() => onOpen(p)}>
            Ver produto
          </button>
          <button className="btn icon" onClick={() => onAdd(p)} aria-label={`Adicionar ${p.name} ao carrinho`}>
            <Icon name="cart" size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Carousel({ items, onOpen, onAdd }) {
  const ref = useRef(null);

  const move = (direction) => {
    if (!ref.current) return;
    ref.current.scrollBy({
      left: direction * ref.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="section" id="destaques">
      <h2 className="title">Produtos que encantam ♡</h2>

      <div className="car-wrap">
        <button className="arrow l" onClick={() => move(-1)} aria-label="Anterior">
          <Icon name="chevronLeft" />
        </button>

        <div className="track" ref={ref}>
          {items.map((p) => (
            <Card key={p.id} p={p} small onOpen={onOpen} onAdd={onAdd} />
          ))}
        </div>

        <button className="arrow r" onClick={() => move(1)} aria-label="Próximo">
          <Icon name="chevronRight" />
        </button>
      </div>
    </section>
  );
}

function Catalog({
  search, setSearch, cat, setCat,
  onlyNew, setOnlyNew, onOpen, onAdd,
}) {
  const list = useMemo(() => {
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!cat || p.category === cat) &&
      (!onlyNew || p.isNew)
    );
  }, [search, cat, onlyNew]);

  const clear = () => {
    setSearch("");
    setCat("");
    setOnlyNew(false);
  };

  return (
    <section className="section" id="produtos">
      <h2 className="title">Nossos produtos ♡</h2>

      <div className="filters">
        <input
          type="search"
          placeholder="Pesquisar pelo nome"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <button
          className={"btn ghost" + (onlyNew ? " on" : "")}
          onClick={() => setOnlyNew(!onlyNew)}
        >
          Novidades
        </button>

        <button className="btn ghost" onClick={clear}>
          Limpar filtros
        </button>
      </div>

      <p className="muted count">{list.length} de {PRODUCTS.length} produtos</p>

      {list.length ? (
        <div className="grid">
          {list.map((p) => (
            <Card key={p.id} p={p} onOpen={onOpen} onAdd={onAdd} />
          ))}
        </div>
      ) : (
        <p className="empty">
          Nenhum produto encontrado. Tente outro nome ou{" "}
          <button className="link" onClick={clear}>limpe os filtros</button>.
        </p>
      )}
    </section>
  );
}

function ProductModal({ p, onClose, onAdd, onBuy }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="link back" onClick={onClose}>← Voltar ao catálogo</button>

        <div className="detail">
          <div className="big"><Photo p={p} /></div>

          <div>
            <p className="muted">{p.category}</p>
            <h2 className="script">{p.name}</h2>
            <strong className="price lg">Preço negociável</strong>

            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuir">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Aumentar">+</button>
            </div>

            <div className="card-actions">
              <button className="btn ghost" onClick={() => { onAdd(p, qty); onClose(); }}>
                Adicionar ao carrinho
              </button>
              <button className="btn" onClick={() => onBuy(p, qty)}>Comprar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cart({ cart, setCart, onClose }) {
  const change = (id, direction) => {
    setCart(cart.map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + direction) } : i
    ));
  };

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Carrinho">
        <header>
          <h2 className="script">Seu carrinho</h2>
          <button className="link" onClick={onClose} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </header>

        {!cart.length && (
          <p className="empty">Seu carrinho está vazio. Escolha uma peça para começar.</p>
        )}

        <ul>
          {cart.map((i) => (
            <li key={i.id}>
              <div className="mini"><Photo p={i} /></div>

              <div className="grow">
                <b>{i.name}</b>
                <span>Preço negociável</span>

                <div className="qty sm">
                  <button onClick={() => change(i.id, -1)} aria-label="Diminuir">−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => change(i.id, 1)} aria-label="Aumentar">+</button>
                </div>
              </div>

              <button className="link" onClick={() => setCart(cart.filter((c) => c.id !== i.id))}>
                Remover
              </button>
            </li>
          ))}
        </ul>

        <footer>
          <p className="row tot"><span>Valor</span><span>A combinar</span></p>
          <button className="btn" disabled>Finalizar compra (em breve)</button>
          <button className="btn ghost" onClick={onClose}>Continuar comprando</button>
        </footer>
      </aside>
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("neia-cart")) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("");
  const [onlyNew, setOnlyNew] = useState(false);
  const [sel, setSel] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("neia-cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      }),
      { threshold: 0.1 }
    );

    document.querySelectorAll(".section, .benefits").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const add = (p, qty = 1) => {
    setCart((current) =>
      current.find((i) => i.id === p.id)
        ? current.map((i) => i.id === p.id ? { ...i, qty: i.qty + qty } : i)
        : [...current, { ...p, qty }]
    );
  };

  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  const nav = (id) => {
    setMenu(false);
    go(id);
  };

  const Social = () => (
    <>
      <a href={LINKS.shopee} target="_blank" rel="noreferrer" className="chip shopee">Shopee</a>
      <a href={LINKS.tiktok} target="_blank" rel="noreferrer" className="chip">TikTok Shop</a>
    </>
  );

  return (
    <>
      <div className="topbar">
        <span><Icon name="shield" size={18} /> Compra segura</span>
        <span><Icon name="heart" size={17} /> Feito com amor</span>
        <span className="soc"><Social /></span>
      </div>

      <header className="header">
        <button className="logo" onClick={() => nav("inicio")} aria-label="Ateliê Neia Biscuit">
          <small>Ateliê</small>
          <b>Neia</b>
          <small>biscuit ♡</small>
        </button>

        <nav className={menu ? "open" : ""}>
          {[
            ["inicio", "Início"],
            ["produtos", "Produtos"],
            ["contato", "Contato"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => nav(id)}>{label}</button>
          ))}
        </nav>

        <form className="search" onSubmit={(e) => { e.preventDefault(); go("produtos"); }}>
          <input
            type="search"
            placeholder="O que você procura?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Pesquisar produtos"
          />
          <button aria-label="Pesquisar"><Icon name="search" size={22} /></button>
        </form>

        <button className="ic" aria-label="Minha conta" title="Conta (em breve)">
          <Icon name="user" />
        </button>

        <button className="ic cart" onClick={() => setCartOpen(true)} aria-label={`Carrinho, ${count} itens`}>
          <Icon name="cart" />
          <i>{count}</i>
        </button>

        <button className="ic burger" onClick={() => setMenu(!menu)} aria-label="Menu">
          <Icon name="menu" />
        </button>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-text">
            <p className="script sub">Ateliê Neia ♡</p>
            <h1 className="script">Arte em biscuit, feita com amor</h1>
            <p>Peças especiais para transformar momentos em lembranças inesquecíveis.</p>
            <button className="btn" onClick={() => go("produtos")}>
              Conheça nossos produtos <Icon name="arrow" size={18} />
            </button>
          </div>

          <div className="hero-img">
            <div className="blob" />
            <img
              src="/destaque.jpg"
              alt="Peças artesanais do Ateliê Neia Biscuit"
              className="hero-photo"
            />
          </div>
        </section>

        <div className="benefits">
          {[
            ["diamond", "Qualidade em cada detalhe"],
            ["lock", "Compra segura"],
            ["heart", "Feito com muito amor"],
          ].map(([icon, label]) => (
            <div key={label}>
              <span><Icon name={icon} size={23} /></span>
              {label}
            </div>
          ))}
        </div>

        <Catalog
          search={search}
          setSearch={setSearch}
          cat={cat}
          setCat={setCat}
          onlyNew={onlyNew}
          setOnlyNew={setOnlyNew}
          onOpen={setSel}
          onAdd={add}
        />

        <Carousel
          items={PRODUCTS.filter((p) => p.featured)}
          onOpen={setSel}
          onAdd={add}
        />

        <section className="section stores">
          <h2 className="title">Compre também em nossas lojas oficiais</h2>
          <div className="store-btns">
            <a className="btn shopee" href={LINKS.shopee} target="_blank" rel="noreferrer">
              Comprar pela Shopee
            </a>
            <a className="btn" href={LINKS.tiktok} target="_blank" rel="noreferrer">
              Comprar pelo TikTok Shop
            </a>
          </div>
        </section>

        <section className="section faq" id="faq">
          <h2 className="title">Perguntas frequentes ♡</h2>
          {FAQ.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
      </main>

      <footer className="footer" id="contato">
        <div className="logo light">
          <small>Ateliê</small>
          <b>Neia</b>
          <small>biscuit ♡</small>
        </div>

        <div className="flinks">
          {[
            ["inicio", "Início"],
            ["produtos", "Produtos"],
            ["contato", "Contato"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => go(id)}>{label}</button>
          ))}
        </div>

        <div className="flinks">
          <a href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={LINKS.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          <a href={LINKS.shopee} target="_blank" rel="noreferrer">Shopee</a>
          <a href={LINKS.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>

        <p className="info">
          Informações comerciais: CNPJ/CPF, cidade e horário de atendimento — preencher.
        </p>
        <p className="copy">
          ©️ {new Date().getFullYear()} Ateliê Neia Biscuit. Todos os direitos reservados. ♡
        </p>
      </footer>

      {sel && (
        <ProductModal
          p={sel}
          onClose={() => setSel(null)}
          onAdd={(p, q) => { add(p, q); setCartOpen(true); }}
          onBuy={(p, q) => { add(p, q); setSel(null); setCartOpen(true); }}
        />
      )}

      {cartOpen && (
        <Cart
          cart={cart}
          setCart={setCart}
          onClose={() => setCartOpen(false)}
        />
      )}
    </>
  );
}