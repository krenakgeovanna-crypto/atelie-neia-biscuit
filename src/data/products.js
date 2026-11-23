// ============================================================
 // CONFIGURAÇÃO DA LOJA — Ateliê Neia Biscuit
 // ============================================================

export const LINKS = {
  shopee: "https://s.shopee.com.br/3fn8Na8kug",
  tiktok: "https://www.tiktok.com/@neiagomes050?_r=1&_t=ZS-91992dUjlZw",
  instagram: "https://www.instagram.com/",
  whatsapp: "https://wa.me/5533997072872",
};

export const CATEGORIES = [
  { name: "Bonecas em biscuit", icon: "🎀" },
  { name: "Personagens", icon: "🧸" },
  { name: "Flores e arranjos", icon: "🌸" },
  { name: "Lembrancinhas", icon: "🎁" },
  { name: "Decoração", icon: "🏡" },
  { name: "Peças personalizadas", icon: "✨" },
];

// ============================================================
// 22 PRODUTOS
// ============================================================

const base = (i) => {
  const n = String(i).padStart(2, "0");

  return {
    id: i,
    name: `Produto ${n}`,
    category: CATEGORIES[(i - 1) % 6].name,
    price: 30 + i * 5,
    description: "Descrição do produto.",
    details: "Adicione aqui os detalhes deste produto.",
    stock: "Sob encomenda",
    image: `/produtos/produto-${n}.jpg`,
    isNew: i > 18,
    featured: i % 4 === 1,
  };
};

export const PRODUCTS = Array.from(
  { length: 22 },
  (_, k) => base(k + 1)
);

// ============================================================
// PERGUNTAS FREQUENTES
// ============================================================

export const FAQ = [
  ["Como faço meu pedido?", "Entre em contato com o Ateliê para fazer seu pedido."],
  ["Vocês fazem peças personalizadas?", "Consulte as opções de personalização disponíveis."],
  ["Qual é o prazo de produção?", "Consulte o prazo no momento do pedido."],
  ["Como funciona a entrega?", "Consulte as opções de entrega disponíveis."],
  ["Como posso acompanhar meu pedido?", "Entre em contato com o Ateliê para receber informações."],
];

export const ABOUT_TEXT =
  "Texto da história do Ateliê Neia Biscuit — substituir pelo relato real da artesã, sua trajetória e o carinho de cada peça modelada à mão.";

export const money = (v) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });