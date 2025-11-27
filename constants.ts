import { Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Comida Chilena',
    icon: '🥟',
    color: 'bg-orange-500',
    words: [
      'Cazuela', 'Pastel de Choclo', 'Empanada de Pino', 'Sopaipilla', 'Completo Italiano', 
      'Curanto', 'Porotos con Riendas', 'Humitas', 'Charquicán', 'Marraqueta', 
      'Hallulla', 'Chorrillana', 'Machas a la Parmesana', 'Mote con Huesillo', 'Terremoto', 
      'Pebre', 'Pan Amasado', 'Alfajor', 'Cuchuflí', 'Súper 8', 
      'Negrita (Chokita)', 'Bilz y Pap', 'Pisco Sour', 'Melón con Vino', 'Arrollado de Huaso',
      'Chilenito', 'Empanada de Queso', 'Milcao', 'Chapalele', 'Cancato',
      'Caldillo de Congrio', 'Chupe de Locos', 'Torta de Milhojas', 'Berlín', 'Conejo Escabechado',
      'Prietas', 'Anticucho', 'Asado', 'Chunchules', 'Malaya'
    ]
  },
  {
    id: 'places',
    name: 'Lugares de Chile',
    icon: '🏔️',
    color: 'bg-blue-500',
    words: [
      'Torres del Paine', 'Desierto de Atacama', 'Isla de Pascua', 'Valparaíso', 'Cerro San Cristóbal', 
      'La Moneda', 'Costanera Center', 'Chiloé', 'Lago Villarrica', 'Viña del Mar', 
      'Cajón del Maipo', 'Fantasilandia', 'Estadio Nacional', 'Mercado Central', 'Pucón', 
      'San Pedro de Atacama', 'Puerto Varas', 'Valdivia', 'Muelle Vergara', 'Plaza Italia',
      'Barrio Bellavista', 'Parque O\'Higgins', 'Cerro Santa Lucía', 'Laguna Roja', 'Mano del Desierto',
      'Volcán Osorno', 'Saltos del Petrohué', 'Catedral de Santiago', 'Palacio Baburizza', 'Reloj de Flores',
      'Plaza de Armas', 'Feria Fluvial', 'Lago Todos los Santos', 'Termas Geométricas', 'Huilo Huilo',
      'Puerto Montt', 'Iquique', 'La Serena', 'Concepción', 'Punta Arenas'
    ]
  },
  {
    id: 'disney',
    name: 'Disney & Pixar',
    icon: '✨',
    color: 'bg-purple-500',
    words: [
      'Mickey Mouse', 'Pato Donald', 'Elsa', 'Moana', 'Woody', 
      'Buzz Lightyear', 'Nemo', 'Dory', 'Simba', 'Rayo McQueen', 
      'Los Increíbles', 'Stitch', 'Winnie the Pooh', 'Blanca Nieves', 'Cenicienta', 
      'Mulan', 'Coco', 'Wall-E', 'Up', 'Intensamente (Alegría)', 
      'Mike Wazowski', 'Sulley', 'Shrek (Impostor)', 'Ariel (Sirenita)', 'Bestia',
      'Aladdin', 'Genio', 'Peter Pan', 'Campanita', 'Hércules',
      'Tarzán', 'Rapunzel', 'Mérida', 'Tiana', 'Pocahontas',
      'Olaf', 'Timón', 'Pumba', 'Jessie', 'Señor Cara de Papa'
    ]
  },
  {
    id: 'sports',
    name: 'Deportes y Juegos',
    icon: '⚽',
    color: 'bg-green-500',
    words: [
      'Fútbol', 'Tenis', 'Básquetbol', 'Vóleibol', 'Natación', 
      'Rodeo', 'Rayuela', 'Trompo', 'Emboque', 'Volantín', 
      'Carrera de Sacos', 'Palo Ensebado', 'Luche', 'Escondida', 'Pillarse', 
      'Silla Musical', 'Quemados', 'Bachillerato', 'Dominó', 'Carioca',
      'Escoba (Cartas)', 'Brisca', 'Truco', 'Ajedrez', 'Ping Pong',
      'Gimnasia', 'Karate', 'Boxeo', 'Surf', 'Skate',
      'Ciclismo', 'Rugby', 'Golf', 'Hockey', 'Padel',
      'Maratón', 'Salto Alto', 'Lanzamiento de Bala', 'Pesas', 'Crossfit'
    ]
  },
  {
    id: 'animals',
    name: 'Reino Animal',
    icon: '🐾',
    color: 'bg-yellow-500',
    words: [
      'Perro', 'Gato', 'León', 'Tigre', 'Elefante', 
      'Jirafa', 'Cóndor', 'Puma', 'Huemul', 'Pudú', 
      'Pingüino', 'Delfín', 'Ballena', 'Tiburón', 'Águila', 
      'Loro', 'Serpiente', 'Araña de Rincón', 'Mosca', 'Zancudo', 
      'Vaca', 'Caballo', 'Cerdo', 'Oveja', 'Gallina', 
      'Mono', 'Gorila', 'Canguro', 'Koala', 'Oso Polar',
      'Panda', 'Zorro', 'Lobo', 'Cocodrilo', 'Tortuga',
      'Rana', 'Mariposa', 'Abeja', 'Hormiga', 'Caracol'
    ]
  },
  {
    id: 'household',
    name: 'Cosas de Casa',
    icon: '🏠',
    color: 'bg-teal-500',
    words: [
      'Refrigerador', 'Microondas', 'Lavadora', 'Cama', 'Sillón',
      'Televisor', 'Control Remoto', 'Espejo', 'Inodoro (Wáter)', 'Ducha',
      'Toalla', 'Cepillo de Dientes', 'Escoba', 'Trapero', 'Olla',
      'Sartén', 'Cuchara', 'Tenedor', 'Cuchillo', 'Plato',
      'Vaso', 'Taza', 'Hervidor', 'Tostador', 'Juguera',
      'Plancha', 'Mesa', 'Silla', 'Lámpara', 'Ampolleta',
      'Enchufe', 'Alargador', 'Cortina', 'Alfombra', 'Cojín',
      'Velador', 'Closet', 'Perchero', 'Llaves', 'Basurero'
    ]
  }
];
