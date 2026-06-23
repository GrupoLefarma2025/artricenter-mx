export interface Testimonio {
  id: string;
  nombre: string;
  foto: string;
  condicion: string;
  texto: string;
  duracion?: string;
}

export const testimonios: Testimonio[] = [
  {
    id: "yolanda",
    nombre: "Yolanda",
    foto: "/images/testimonios/yolanda.png",
    condicion: "Artritis",
    texto:
      'Yo no podía caminar, me dolían las rodillas, no podía tomar una taza con café, no podía peinarme... Aquí me atendieron muy bien y me explicaron. Seguí las instrucciones y mejore demasiado, subo y bajo escaleras, me puedo bañar por si sola. Ahora puedo hacer todo y no dependo de mis hijas. "Les recomiendo que vengan, prueben y cambien su modo de vida".',
  },
  {
    id: "teresa",
    nombre: "Teresa",
    foto: "/images/testimonios/teresa.png",
    condicion: "Osteoartrosis / Artrosis",
    texto:
      'No podía exprimir jergas o trapos de cocina, me dolían los hombros, las rodillas... Me ofrecieron facilidades de pago y llevo 1 año y medio y estoy muy contenta con mi mejoría y la atención en Artricenter. "Esto es un tratamiento integral para mejorar las articulaciones y no, nos va a dañar".',
    duracion: "1 año y medio",
  },
  {
    id: "julia",
    nombre: "Sra. Julia",
    foto: "/images/testimonios/julia.png",
    condicion: "Dolor articular",
    texto:
      'Ella uso el Theradol lo cual le ayudo considerablemente a disminuir el dolor articular, junto con los suplementos adecuados y un programa nutricional completo. "Yo en 7 días comencé a ver una gran mejoría, por eso recomiendo a Artricenter".',
    duracion: "7 días",
  },
  {
    id: "abelino",
    nombre: "Sr. Abelino",
    foto: "/images/testimonios/abelino.png",
    condicion: "Dolor intenso en brazos",
    texto:
      'El Sr. Abelino asistió a Artricenter a su consulta de valoración médica ya que padecía de un dolor muy intenso en sus brazos lo cual le impedía dormir y desarrollar actividades incluso en su trabajo, gracias a Artricenter y al tratamiento médico ese dolor fue disminuyendo y en la actualidad ya no lo percibe: "El personal médico ha sido muy atento conmigo y me explica muy bien, yo pienso que muchas personas deberían tomar este tratamiento para mejorar su calidad de vida".',
  },
  {
    id: "ernestina",
    nombre: "Ernestina González",
    foto: "/images/testimonios/ernestina.png",
    condicion: "Rodillas",
    texto:
      'Nuestra paciente Ernestina González llego a Artricenter después de haber visto mejoría en su esposo con el Tratamiento Médico Integral, con gran energía y felicidad nos menciona que vio resultados al poco tiempo de haber comenzado su tratamiento y resalta el programa nutricional y la constancia como clave para la mejoría de sus articulaciones en las rodillas: "Conocer Artricenter a mí me ayudo mucho, el cual también puede ayudar a mucha gente, que se dé la oportunidad porque de esto depende llevar una vida sana".',
  },
];
