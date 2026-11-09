export const PLATFORM_LIMITS = {
  instagram: 2200,
  x: 280,
  linkedin: 3000,
  youtube: 5000,
  tiktok: 2200,
};

export const HASHTAG_PRESETS = [
  {
    id: 'dev-stack',
    label: { 'pt-BR': 'Dev Full-Stack', en: 'Full-Stack Dev' },
    tags: '#webdevelopment #reactjs #php #sqlite #coding #fullstack',
  },
  {
    id: 'build-in-public',
    label: { 'pt-BR': 'Build in Public', en: 'Build in Public' },
    tags: '#buildinpublic #indiehacker #sideproject #opensource #devtools',
  },
  {
    id: 'career-tips',
    label: { 'pt-BR': 'Carreira Tech', en: 'Tech Career' },
    tags: '#softwareengineering #careergrowth #programacao #developerlife',
  },
];

export const QUICK_TEMPLATES = [
  {
    id: 'tpl-1',
    platform: 'linkedin',
    pillar: 'behindTheScenes',
    title: {
      'pt-BR': 'Atualização Semanal (Build in Public)',
      en: 'Weekly Build in Public Update',
    },
    content: {
      'pt-BR':
        'Essa semana avancei na arquitetura do meu gerenciador de conteúdo pessoal (ContentFlow).\n\nO que foi construído:\n✅ Interface reativa em React com suporte bilíngue (PT/EN)\n✅ API REST enxuta em PHP puro com SQLite\n✅ Calendário editorial integrado\n\nQual ferramenta própria você está construindo este mês?',
      en: 'This week I made solid progress on my personal content manager (ContentFlow).\n\nWhat shipped:\n✅ Bilingual React interface (EN/PT-BR)\n✅ Zero-framework PHP REST API with SQLite\n✅ Integrated editorial calendar\n\nWhat personal tool are you building this month?',
    },
    hashtags: '#buildinpublic #reactjs #php #opensource #webdev',
  },
  {
    id: 'tpl-2',
    platform: 'x',
    pillar: 'tutorial',
    title: {
      'pt-BR': 'Dica Rápida de Código (Thread/Post)',
      en: 'Quick Coding Tip (Thread/Post)',
    },
    content: {
      'pt-BR':
        'Dica prática: para projetos pessoais e ferramentas locais, SQLite + PDO em PHP 8 entrega performance incrível com zero configuração de servidor externo. Simples, rápido e portátil.',
      en: 'Quick tip: for personal tools and local-first apps, SQLite + PDO in PHP 8 delivers incredible speed with zero external database setup. Simple, fast, and portable.',
    },
    hashtags: '#php #sqlite #webdev #codingtips',
  },
  {
    id: 'tpl-3',
    platform: 'instagram',
    pillar: 'tutorial',
    title: {
      'pt-BR': 'Carrossel Técnico Passo a Passo',
      en: 'Step-by-Step Tech Carousel',
    },
    content: {
      'pt-BR':
        '5 passos para organizar sua produção de conteúdo técnico sem perder horas toda semana:\n\n1. Defina 3 a 4 pilares claros\n2. Separe rascunhos de agendamentos\n3. Reaproveite ideias entre formatos\n4. Acompanhe as métricas reais\n5. Automatize seu fluxo no ContentFlow!\n\nSalve este post para consultar depois.',
      en: '5 steps to organize your technical content workflow without losing hours every week:\n\n1. Define 3-4 clear content pillars\n2. Separate ideation from scheduling\n3. Repurpose across formats\n4. Track real engagement metrics\n5. Centralize your pipeline in ContentFlow!\n\nSave this post for later.',
    },
    hashtags: '#contentcreator #techcreator #reactjs #productivity',
  },
];

export const INITIAL_ACCOUNTS = [
  {
    id: 1,
    platform: 'instagram',
    handle: '@junior.codes',
    displayName: 'Junior Oliveira • Dev & Design',
    followers: 4820,
    growth30d: 8.4,
    reach30d: 28400,
    engagementRate: 5.8,
    weeklyTarget: 4,
    active: true,
    bestTime: '18:30 • Ter / Qui',
  },
  {
    id: 2,
    platform: 'linkedin',
    handle: 'in/junior-oliveira-dev',
    displayName: 'Junior Oliveira',
    followers: 3190,
    growth30d: 11.2,
    reach30d: 34900,
    engagementRate: 6.4,
    weeklyTarget: 3,
    active: true,
    bestTime: '09:00 • Ter / Qua / Qui',
  },
  {
    id: 3,
    platform: 'x',
    handle: '@junior_devflow',
    displayName: 'Junior (ContentFlow)',
    followers: 1940,
    growth30d: 6.1,
    reach30d: 19200,
    engagementRate: 4.3,
    weeklyTarget: 5,
    active: true,
    bestTime: '12:15 • Seg a Sex',
  },
  {
    id: 4,
    platform: 'youtube',
    handle: '@JuniorCodeStudio',
    displayName: 'Junior Code Studio',
    followers: 2650,
    growth30d: 9.7,
    reach30d: 41800,
    engagementRate: 7.1,
    weeklyTarget: 1,
    active: true,
    bestTime: '19:00 • Quarta / Sábado',
  },
  {
    id: 5,
    platform: 'tiktok',
    handle: '@junior.devclips',
    displayName: 'Junior Dev Clips',
    followers: 1580,
    growth30d: 14.5,
    reach30d: 22600,
    engagementRate: 6.9,
    weeklyTarget: 2,
    active: true,
    bestTime: '20:00 • Ter / Sex',
  },
];

export const INITIAL_POSTS = [
  {
    id: 101,
    title: 'Arquitetura do ContentFlow: React + PHP Puro + SQLite',
    platform: 'linkedin',
    pillar: 'behindTheScenes',
    status: 'published',
    mediaType: 'carousel',
    scheduledAt: '2026-11-05T09:00:00',
    content:
      'Comecei a desenvolver o ContentFlow para centralizar toda a gestão das minhas redes sociais em uma aplicação local, rápida e sem mensalidades.\n\nEscolhi React.js no front-end pela fluidez da interface e PHP 8 puro com SQLite no back-end para manter zero dependências pesadas e fácil execução.\n\nNos próximos dias vou compartilhar os detalhes do calendário editorial e suporte multi-idioma (PT-BR / EN)!',
    hashtags: '#buildinpublic #reactjs #php #sqlite #softwareengineering',
    metrics: {
      reach: 6420,
      likes: 318,
      comments: 47,
      shares: 29,
    },
  },
  {
    id: 102,
    title: '5 motivos para usar SQLite em ferramentas pessoais',
    platform: 'instagram',
    pillar: 'tutorial',
    status: 'published',
    mediaType: 'carousel',
    scheduledAt: '2026-11-07T18:30:00',
    content:
      'Muitas vezes subestimamos o SQLite, mas ele é perfeito para ferramentas pessoais e aplicações local-first:\n\n1. Arquivo único fácil de fazer backup\n2. Zero servidor de banco separado para configurar\n3. Extremamente rápido em leituras locais\n4. Suporte nativo via PDO no PHP\n5. Ideal para prototipar e evoluir projetos reais.',
    hashtags: '#sqlite #php #webdev #programacao #desenvolvedor',
    metrics: {
      reach: 5190,
      likes: 412,
      comments: 38,
      shares: 64,
    },
  },
  {
    id: 103,
    title: 'Thread: Como estruturei o i18n (PT-BR / EN) sem bibliotecas pesadas',
    platform: 'x',
    pillar: 'tutorial',
    status: 'scheduled',
    mediaType: 'text',
    scheduledAt: '2026-11-11T12:15:00',
    content:
      'Implementar suporte multi-idioma (PT-BR e Inglês) no React não precisa de dezenas de pacotes externos. Com um Context enxuto + Intl.DateTimeFormat e persistência em localStorage, a troca de idioma fica instantânea!',
    hashtags: '#reactjs #javascript #i18n #frontend #webdev',
    metrics: {
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    },
  },
  {
    id: 104,
    title: 'Tour completo pelo Dashboard e Calendário do ContentFlow',
    platform: 'youtube',
    pillar: 'launch',
    status: 'scheduled',
    mediaType: 'video',
    scheduledAt: '2026-11-14T19:00:00',
    content:
      'Neste vídeo mostro na prática como funciona o ContentFlow por dentro: criação de posts com contador de caracteres por rede social, calendário editorial interativo e API REST em PHP puro conectada ao SQLite.',
    hashtags: '#contentflow #react #php #fullstack #sideproject',
    metrics: {
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    },
  },
  {
    id: 105,
    title: 'Dica rápida: Organizando pilares de conteúdo na semana',
    platform: 'tiktok',
    pillar: 'career',
    status: 'scheduled',
    mediaType: 'video',
    scheduledAt: '2026-11-16T20:00:00',
    content:
      'Como manter consistência nas redes sociais sendo dev: divida seus assuntos em 4 pilares claros (Tutoriais, Bastidores, Carreira e Projetos) e deixe a fila agendada no início da semana.',
    hashtags: '#devtok #programador #produtividade #techcreator',
    metrics: {
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    },
  },
  {
    id: 106,
    title: 'Rascunho: Checklist de segurança em repositórios públicos no GitHub',
    platform: 'linkedin',
    pillar: 'career',
    status: 'draft',
    mediaType: 'text',
    scheduledAt: '2026-11-19T09:00:00',
    content:
      'Antes de tornar qualquer repositório público no GitHub, sempre revise:\n- Arquivo LICENSE definido na raiz (ex: MIT)\n- .env fora do histórico e .env.example documentado\n- Nenhum token ou dado sensível nos commits\n- README claro com instruções de execução e ROADMAP do que vem pela frente.',
    hashtags: '#github #opensource #cleanarchitecture #devlife',
    metrics: {
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    },
  },
];
