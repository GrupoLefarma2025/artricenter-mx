export interface NavItem {
  label: string;
  page: string;
  hash?: string;
  children?: NavItem[];
}

export interface CtaConfig {
  label: string;
  href: string;
}

export interface NavConfig {
  items: NavItem[];
  ctas: {
    edith: CtaConfig;
    whatsapp: CtaConfig;
  };
}

export function validateNavItems(items: NavItem[]): void {
  items.forEach(item => {
    if (!item.label || !item.page) {
      throw new Error(`Invalid nav item: ${JSON.stringify(item)}`);
    }
    if (item.children) {
      validateNavItems(item.children);
    }
  });
}

export const navItems: NavItem[] = [
  {
    label: "Quienes Somos",
    page: "/",
    children: [
      { label: "Artricenter", page: "/", hash: "#artricenter" },
      { label: "Nuestra Historia", page: "/", hash: "#nuestra-historia" },
      { label: "Enfermedades que Tratamos", page: "/", hash: "#enfermedades" },
      { label: "Nuestros Médicos", page: "/", hash: "#nuestros-medicos" },
      { label: "Misión | Visión | Valores", page: "/", hash: "#mision-vision-valores" }
    ]
  },
  {
    label: "Especialidades",
    page: "/especialidades",
    children: [
      { label: "Osteoartrosis / Espondiloartritis", page: "/especialidades", hash: "#artrosis-osteoartrosis" },
      { label: "Artritis Reumatoide", page: "/especialidades", hash: "#artritis-reumatoide" },
      { label: "Fibromialgia", page: "/especialidades", hash: "#fibromialgia" },
      { label: "Espondilitis Anquilosante", page: "/especialidades", hash: "#espondilitis-anquilosante" },
      { label: "Reumatismos de Partes Blandas", page: "/especialidades", hash: "#reumatismos-de-partes-blandas" }
    ]
  },
  {
    label: "Tratamiento Médico Integral",
    page: "/tratamiento-medico-integral",
    children: [
      { label: "Diagnóstico", page: "/tratamiento-medico-integral", hash: "#diagnostico" },
      { label: "PAIPER", page: "/tratamiento-medico-integral", hash: "#paiper" }
    ]
  },
  {
    label: "Club Vida y Salud",
    page: "/club-vida-y-salud",
    children: [
      { label: "Club Vida y Salud", page: "/club-vida-y-salud", hash: "#club-vida-y-salud" },
      { label: "Testimonios", page: "/club-vida-y-salud", hash: "#testimonios" }
    ]
  },
  // {
  //   label: "Blog",
  //   page: "/blog"
  // },
  {
    label: "Contáctanos",
    page: "/contactanos",
    children: [
      { label: "Contáctanos", page: "/contactanos", hash: "#contactanos" }
    ]
  }
];

export const navConfig: NavConfig = {
  items: navItems,
  ctas: {
    edith: {
      label: "Agendar valoracion",
      href: "/contactanos#contactanos"
    },
    whatsapp: {
      label: "WhatsApp para cita",
      href: "https://wa.me/525559890607?text=Hola%2C%20quiero%20agendar%20una%20consulta%20de%20valoracion."
    }
  }
};
