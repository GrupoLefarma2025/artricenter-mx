export interface Branch {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  mapsUrl: string;
}

export const branches: Branch[] = [
  {
    id: "la-raza",
    name: "La Raza",
    logo: "/assets/images/branches/la-raza.webp",
    address: "Calzada Vallejo 233<br>Héroes de Nacozári, GAM<br>07780 CDMX",
    phone: "55 5989 0607",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Artricenter+La+Raza"
  },
  {
    id: "atizapan",
    name: "Atizapán",
    logo: "/assets/images/branches/atizapan.webp",
    address: "Boulevard Adolfo López Mateos No. 65,<br>Manzana 1, Lote 16, Zona 8,<br>El Potrero, 57975,<br>Ex-Ejido de Atizapán III, C.P. 57975",
    phone: "55 5989 0607",
    mapsUrl: "https://goo.gl/maps/pAipxVAepPY7jqG48"
  },
  {
    id: "viaducto",
    name: "Viaducto",
    logo: "/assets/images/branches/viaducto.webp",
    address: "Viaducto Río de la Piedad 130<br>Jamaica, Venustiano Carranza<br>15800 CDMX",
    phone: "55 5989 0607",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Artricenter+Viaducto"
  }
];
