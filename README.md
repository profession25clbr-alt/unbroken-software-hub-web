# Unbroken Software Hub — Landing con asistente de IA

Sitio web de **Unbroken Software Hub**, servicio de desarrollo de software y páginas web a medida en Chile: una landing de una página (React + Vite) servida por un pequeño backend Node/Express que además expone un **chat con IA** (Google Gemini) con cadena de modelos de respaldo.

🌐 **Producción:** https://unbrokensoftwarehub.cl

> **Estado actual:** en producción desde 2026-09-30 (AWS Lightsail + Docker + nginx, HTTPS con Let's Encrypt) · despliegue automático por tag con GitHub Actions · sin base de datos · el servidor no guarda los mensajes del chat.

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso / Ejecución](#uso--ejecución)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [El chat con IA](#el-chat-con-ia)
- [Frontend en detalle](#frontend-en-detalle)
- [SEO y visibilidad en IAs](#seo-y-visibilidad-en-ias)
- [Tests / Pruebas](#tests--pruebas)
- [Despliegue](#despliegue)
- [Variables de entorno y secretos](#variables-de-entorno-y-secretos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Convenciones y estándares](#convenciones-y-estándares)
- [Versionado](#versionado)
- [Estado y límites conocidos](#estado-y-límites-conocidos)
- [Documentación adicional](#documentación-adicional)
- [Autores](#autores)
- [Licencia](#licencia)

---

## Descripción

Landing de presentación para captar clientes. Muestra los servicios (sistemas a medida, sitios web, automatización de procesos, IA aplicada), la forma de trabajo y de pago, el proceso, preguntas frecuentes y formas de contacto (WhatsApp, correo y un **asistente de IA** que responde solo con la información de la empresa).

El proyecto demuestra, entre otras cosas:

- **Prerender de una SPA**: el HTML sale ya armado al compilar (título, encabezados, FAQ), de modo que los rastreadores que no ejecutan JavaScript —buscadores con IA— leen el contenido.
- **Un chat con IA resiliente**: cadena de modelos con respaldo automático ante cuota agotada (429), errores (5xx) o lentitud (timeout), enfriamiento por modelo, límite por IP y tiempo mínimo de respuesta.
- **Un solo proceso Node** que sirve la landing compilada y `/api/chat` en el mismo origen (sin CORS en producción).
- **Despliegue reproducible**: imagen Docker mínima (Alpine + binario de Node), tag → build → Docker Hub → servidor, con verificación de salud antes de dar el deploy por bueno.
- **Consumo mínimo**: ~13 MB reales de RAM en reposo y ~153 KB en la primera visita (ver [Requisitos previos](#requisitos-previos)).

---

## Tecnologías utilizadas

### Frontend

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.2 | Framework UI |
| Vite | 8.2 | Build tool y servidor de desarrollo |
| Tailwind CSS | 4.3 | Estilos (variables CSS por paleta de color) |
| Framer Motion | 13.2 | Animaciones de entrada y scroll (respeta «reducir movimiento») |
| react-icons | 5.7 | Íconos |
| react-dom/server | 19.2 | Prerender del HTML al compilar (`scripts/prerender.mjs`) |
| Oxlint | 1.82 | Linter |

### Backend

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 22 | Runtime |
| Express | 5.2 | Servidor HTTP: estáticos, `/api/chat`, `/healthz` |
| express-rate-limit | 8.7 | Límite de peticiones por IP en el chat |
| cors | 2.8 | CORS para desarrollo (en producción es el mismo origen) |
| dotenv | 17.4 | Variables de entorno |
| Google Gemini API | — | Modelos de IA del chat (vía `fetch`, sin SDK) |

### Infraestructura

| Tecnología | Rol |
|---|---|
| Docker (multi-stage, `alpine:3.24`) | Imagen de ~147 MB de capas |
| Docker Hub | Registro público de imágenes |
| GitHub Actions | CI/CD por tag `UW*.*.*` |
| AWS Lightsail (Debian 12) | Servidor (1 GB RAM) compartido con otros sitios |
| nginx + Let's Encrypt (certbot) | Proxy inverso, HTTPS, compresión y límite de peticiones |
| AWS Route 53 | DNS del dominio |

---

## Requisitos previos

- **Node.js 22** y npm (para desarrollo).
- Una **API key de Google AI Studio** (gratis) para el chat.
- **Docker** (opcional, solo para probar la imagen de producción).

### Consumo de recursos (valores medidos en producción)

| Medida | Valor |
|---|---|
| RAM del proceso Node en reposo | ~13 MB reales (anónimos) · ~18-22 MiB según `docker stats` |
| Límite del contenedor (`mem_limit`) | 256 MiB |
| Imagen Docker | 201 MB (`docker image ls`) · ~147 MB de capas: Node 129 + Alpine 12 + dependencias 5 + landing 0,5 |
| Primera visita (con gzip) | ≈ 153 KB: HTML 12 KB + CSS 9 KB + JS 111 KB + foto 20 KB (más Google Fonts) |
| Visitas repetidas | JS/CSS en caché un año (`immutable`, con hash en el nombre) |

El costo fijo del servidor es Docker (~90 MB), compartido entre todos los sitios alojados; la landing suma solo lo suyo.

---

## Instalación

```bash
git clone https://github.com/profession25clbr-alt/unbroken-software-hub-web.git
cd unbroken-software-hub-web
npm install
cp .env.example .env      # y completar GEMINI_API_KEY
```

---

## Configuración

Copia `.env.example` a `.env` (está en `.gitignore`: **nunca se sube**). Lo mínimo es `GEMINI_API_KEY`. La lista completa está en [Variables de entorno y secretos](#variables-de-entorno-y-secretos).

---

## Uso / Ejecución

### Desarrollo (hot-reload)

Dos terminales: el backend del chat y Vite.

```bash
npm run server     # chat en http://localhost:8787
npm run dev        # landing en http://localhost:5173 (el front apunta al chat en :8787)
```

### Build de producción

```bash
npm run build      # vite build + vite build --ssr + prerender → dist/
npm run server     # sirve dist/ y /api/chat en http://localhost:8787
```

`npm run build` encadena tres pasos: compila el cliente, compila el entry de servidor (`dist-ssr/`, solo para el prerender) y escribe el HTML renderizado dentro de `dist/index.html`.

### Imagen Docker

```bash
docker build -t unbroken-web .
docker run --rm -p 8787:8787 -e GEMINI_API_KEY=... unbroken-web
```

### Otros scripts

| Script | Qué hace |
|---|---|
| `npm run lint` | Oxlint |
| `npm run preview` | Vista previa del build del cliente con Vite |
| `npm run test:fallback` | Prueba manual de fallback de modelos (ver [Tests](#tests--pruebas)) |

---

## Arquitectura del proyecto

```
Internet ──443──▶ nginx (host) ──▶ 127.0.0.1:8101 ──▶ contenedor unbroken-web (Node/Express :8787)
                   │  HTTPS, gzip                        ├─ GET  /*          landing prerenderizada (dist/)
                   │  limit_req 10/min en /api/chat      ├─ POST /api/chat   ──▶ Gemini API (cadena de modelos)
                   └─ www → dominio raíz                 └─ GET  /healthz    estado
```

- **Mismo origen**: la página y el chat salen del mismo dominio, sin CORS. El front usa `VITE_CHAT_API_URL=/api/chat` (se fija en el build de la imagen).
- **Dos capas de límite** en el chat: nginx (`limit_req`, 10 por minuto por IP) y Node (`express-rate-limit`, 10 por minuto, con `trust proxy` para ver la IP real).
- **Sin estado**: no hay base de datos ni almacenamiento; el historial de la conversación vive en el navegador y se envía (últimos 8 turnos) con cada mensaje.
- **Imagen mínima**: el runtime parte de `alpine:3.24` y copia solo el binario de `node` (sin npm/yarn); el contenedor corre como usuario no-root con `HEALTHCHECK`.

---

## El chat con IA

El asistente responde **solo con el contenido de `server/context/company.md`** (servicios, forma de pago, proceso, contacto). Cada petición envía ese documento como instrucción de sistema.

### Cadena de modelos

`GEMINI_MODELS` define la prioridad. Por defecto:

```
gemini-3.5-flash-lite → gemini-2.5-flash → gemini-3.6-flash → gemma-4-31b-it
```

| Situación | Comportamiento |
|---|---|
| **429** (cuota agotada) | El modelo queda 60 s en enfriamiento y se salta sin gastar petición |
| **5xx** o timeout (15 s) | Enfriamiento de 15 s y se pasa al siguiente |
| **503** «alta demanda» | 3 reintentos (1 s, 2 s, 3 s) antes de pasar al siguiente |
| Todos en enfriamiento | Se reintenta la cadena completa |
| Falla toda la cadena | Responde 502 y el widget ofrece WhatsApp o correo |

### Reglas del endpoint `POST /api/chat`

| Regla | Valor |
|---|---|
| Mensaje | Máx. 800 caracteres |
| Historial aceptado | Últimos 8 turnos (`user` / `model`) |
| Respuesta | Máx. 2.048 tokens, temperatura 0,4 |
| Límite por IP | 10 peticiones por minuto (429 al excederlo) |
| Tiempo mínimo de respuesta | 2 s (frena el spam rápido sin castigar conexiones lentas) |

Límites del tier gratuito de cada modelo (Google AI Studio):

| Modelo | Peticiones/min | Tokens/min | Peticiones/día |
|---|---|---|---|
| Gemini 3.5 Flash Lite | 15 | 250K | 500 |
| Gemini 3.6 / 3.7 / 3.8 Flash | 5 | 250K | 20 |
| Gemma 4 31B y 26B | 30 | 16K | 14.400 |

Notas: Gemini 2.5 Flash no tiene la cuota anotada (solo se comprobó que responde); Gemini 2.5 Flash Lite devuelve 404 («ya no está disponible para cuentas nuevas»). Cada petición del chat lleva ~1,3K tokens de contexto, así que el tope de 16K tokens/min de Gemma se alcanza con solo 4-5 peticiones por minuto.

### Privacidad

Los mensajes se envían a un proveedor de IA externo para generar la respuesta; el servidor no los guarda. El widget avisa al usuario y le pide no compartir datos personales ni información sensible. Con datos reales de terceros aplicaría la **Ley 21.719** (Protección de Datos Personales, Chile).

---

## Frontend en detalle

### Secciones (en orden)

Hero · Servicios · Automatización · Planes · Proceso · Sobre mí · cinta de tecnologías · **Preguntas frecuentes** · Footer, más los botones flotantes (WhatsApp, correo), el **chat** y un brillo ambiental de fondo.

### Detalles de la interfaz

- **8 paletas** (Forge, Volt, Toxic, Royal, cada una en oscuro y claro) que rotan solas cada 30 s; el cambio manual se recuerda en `localStorage` y se aplica antes del primer pintado (sin destello).
- **Chat**: se abre solo a los 25 s si nadie lo tocó; barra de scroll fina (misma convención que omnicanal-demo).
- **Accesibilidad**: enlace «Saltar al contenido», `aria-*` en menú y chat, `prefers-reduced-motion`.
- **Logo**: una «U» de trazo continuo con un nodo, que es también el favicon (`public/favicon.svg`).

### Cómo está organizado el código

- `src/components/` — una sección o pieza de UI por archivo.
- `src/content/faq.js` — preguntas frecuentes: **una sola fuente** para la sección visible y para los datos estructurados `FAQPage`.
- `src/entry-server.jsx` y `scripts/prerender.mjs` — prerender (no forman parte del bundle del navegador).

---

## SEO y visibilidad en IAs

La landing era una SPA con el `<body>` vacío: los rastreadores de IA (GPTBot, PerplexityBot, ClaudeBot) no ejecutan JavaScript y no veían texto. Se resolvió con **prerender al compilar**: `dist/index.html` trae ~49 KB de HTML con `<h1>`, 8 encabezados de sección y las 7 preguntas frecuentes; en el navegador, React monta con `createRoot` y reemplaza ese HTML (sin hidratación).

Además: datos estructurados `ProfessionalService` (con logo y fundador) y `FAQPage`, `sitemap.xml`, `robots.txt` (bloquea `/api/`), canonical y tarjetas Open Graph/Twitter.

Verificar qué ve un rastreador sin JavaScript:

```bash
curl -s https://unbrokensoftwarehub.cl/ | grep -c "<h1"   # 1
```

---

## Tests / Pruebas

No hay pruebas unitarias ni e2e automatizadas todavía. Hay **scripts de prueba manual** (no corren en CI ni se empaquetan en la imagen):

| Script | Qué prueba |
|---|---|
| `server/test-fallback.mjs` (`npm run test:fallback`) | Agota a propósito la cuota del modelo principal y confirma el cambio a los de respaldo |
| `server/test-carga.mjs` | Simula N visitantes (IPs distintas) conversando durante un minuto y resume qué modelo respondió, latencias y errores |
| `server/test-gemma.mjs` | Llama directo a la API con variantes de la petición para aislar fallas de un modelo |

Los logs de las corridas están en `docs/test-carga/`.

Reproducir la prueba de carga (en una instancia local, que permite simular IPs con `X-Forwarded-For`):

```bash
PORT=8798 TRUST_PROXY=1 node server/index.js
TEST_CHAT_URL=http://localhost:8798/api/chat node server/test-carga.mjs
```

---

## Despliegue

Un **push de tag `UW*.*.*` despliega a producción** (`.github/workflows/deploy.yml`):

```
tag UW1.0.0
   ↓
1. docker build + push  →  <DOCKER_USERNAME>/multiuso-unbroken:unbroken-web-<TAG>   (el build de Vite va dentro del Dockerfile)
2. scp de .env (escrito desde secrets) y docker-compose.yml al servidor
3. docker compose pull && up -d
4. espera a /healthz; si no responde, el job falla y muestra los logs
5. limpia imágenes sin uso de más de 7 días
6. avisa a Bing por IndexNow de que el sitio cambió (si falla, no se cae el deploy)
```

- **Siempre la misma tag**: cada cambio se commitea, se hace push a `main` y se borra y recrea `UW1.0.0` para reemplazar la imagen. Lo hace `./deploy.sh "mensaje"`.
- Un solo deploy a la vez (`concurrency`). Los secretos entran al workflow por variables de entorno, no interpolados en el script.
- El repo de Docker Hub es **público**: la imagen contiene `server/context/company.md` y la landing, nunca claves.
- **Rollback**: cambiar `TAG` en el `.env` del servidor a una versión anterior y `docker compose up -d`.

La infraestructura (servidor, nginx, DNS, firewall, consumo de RAM) se documenta fuera de este repositorio.

---

## Variables de entorno y secretos

### Variables del servidor

| Variable | Por defecto | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | — (obligatoria) | Clave de Google AI Studio |
| `GEMINI_MODELS` | cadena por defecto (ver arriba) | Modelos por prioridad, separados por comas |
| `PORT` | `8787` | Puerto del servidor |
| `ALLOWED_ORIGIN` | `http://localhost:5173` | Origen permitido por CORS (solo desarrollo) |
| `TRUST_PROXY` | `0` | `1` detrás de nginx, para leer la IP real |
| `CHAT_RATE_LIMIT` | `10` | Peticiones por minuto por IP |
| `CHAT_MIN_RESPONSE_MS` | `2000` | Tiempo mínimo de respuesta |
| `GEMINI_TIMEOUT_MS` | `15000` | Tope de espera por intento a un modelo |
| `VITE_CHAT_API_URL` | `http://localhost:8787/api/chat` | (build) URL del chat; la imagen la fija en `/api/chat` |

### Secretos de GitHub Actions

`DOCKER_USERNAME` · `DOCKER_PASSWORD` (token de Docker Hub) · `LIGHTSAIL_HOST` · `LIGHTSAIL_USER` · `LIGHTSAIL_SSH_KEY` (llave privada en base64, propia del CI) · `GEMINI_API_KEY` · `GEMINI_MODELS` · `ALLOWED_ORIGIN`.

⚠️ El `.env` del servidor lo reescribe el pipeline en cada deploy con el valor de estos secretos: para cambiar la cadena de modelos hay que actualizar el secret `GEMINI_MODELS` y volver a desplegar.

---

## Estructura del proyecto

```
.
├── .github/workflows/deploy.yml   # CI/CD por tag UW*.*.*
├── Dockerfile                     # build → deps → runtime (alpine + node)
├── docker-compose.yml             # servicio en el servidor (127.0.0.1:8101)
├── deploy.sh                      # commit + push + recrear la tag fija
├── index.html                     # head: SEO, Open Graph, JSON-LD
├── public/                        # favicon, logos, foto, robots.txt, sitemap.xml
├── scripts/prerender.mjs          # escribe el HTML renderizado en dist/index.html
├── server/
│   ├── index.js                   # Express: estáticos, /api/chat, /healthz
│   ├── context/company.md         # única fuente de información del asistente
│   └── test-*.mjs                 # pruebas manuales
├── src/
│   ├── components/                # secciones y piezas de UI
│   ├── content/faq.js             # preguntas frecuentes
│   ├── entry-server.jsx           # entry del prerender
│   ├── App.jsx · main.jsx
│   └── index.css                  # Tailwind, paletas, barra de scroll
└── docs/                          # ver «Documentación adicional»
```

---

## Convenciones y estándares

- **Fuente única del contenido**: si cambian servicios o precios, actualizar `server/context/company.md` **y** `src/content/faq.js`: el chat y el FAQ deben decir lo mismo.
- **Sin secretos en el repo**: claves solo en `.env` (ignorado) y en los secrets de GitHub.
- **Colores** desde variables CSS del tema (`--color-ember-*`, `--color-steel-*`), no hex sueltos.
- **Git**: commits descriptivos en español, sin acentos, un tema por commit, con el detalle de archivos tocados y la causa de cada cambio.
- **Finales de línea LF** para `*.sh` y `Dockerfile` (`.gitattributes`).
- Linter: `npm run lint`.

---

## Versionado

Se usa **una sola tag de despliegue, `UW1.0.0`**, que se borra y se recrea en cada deploy: no hay historial de versiones publicadas; el historial es el de los commits de `main`.

---

## Estado y límites conocidos

- **Los Gemma de la API son inestables** (errores 500 frecuentes y `gemma-4-31b-it` tarda 40-60 s): quedan solo como último recurso.
- **Los Gemini 3.6/3.7/3.8 Flash permiten solo 20 peticiones por día**: sirven de colchón, no de modelo principal.
- **La cuota gratuita manda**: la cadena aguanta ~28 conversaciones por minuto y ~520 al día con Gemini estable. Con más tráfico habría que pasar a un plan de pago.
- **Sin hidratación**: React reemplaza el HTML prerenderizado al cargar (por diseño, para evitar desajustes).
- **Sin pruebas automatizadas**: solo scripts manuales.
- **El resultado enriquecido de FAQ no aparecerá en Google**: desde 2023 se limita a sitios conocidos de gobierno y salud; el `FAQPage` sirve para que las IAs lean las respuestas.
- **Sin analítica**: no hay medición de visitas.

---

## Documentación adicional

Las notas de trabajo (resultados de las pruebas de modelos, estrategia de visibilidad en IAs, etc.) se mantienen en local en `docs/` y **no se versionan** (están en `.gitignore`). Lo esencial está resumido en este README; los logs de las pruebas de carga están en `docs/test-carga/`.

---

## Autores

| Nombre | Área | Responsabilidades |
|---|---|---|
| **Matheus de Lara André** | Fullstack | Diseño, frontend, backend del chat, infraestructura, CI/CD y pruebas. |

---

## Licencia

Proyecto propio de Unbroken Software Hub. Todos los derechos reservados por el autor; no se ha definido una licencia de código abierto. El uso o distribución del código fuera de este contexto debe contar con autorización.
