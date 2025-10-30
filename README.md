# Detector de caracteres invisibles unicode

![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Update](https://img.shields.io/badge/update-Noviembre%202025-green.svg)

## 📋 Descripción

Herramienta web para detectar, analizar y visualizar caracteres Unicode invisibles en texto. Estos caracteres sin representación visual suelen ser insertados inadvertidamente por modelos de IA durante la generación de texto y pueden causar problemas en ciertos contextos.

![Captura de pantalla de la aplicación](media/image.png)

## 🎬 Demostración

![Demostración del funcionamiento](media/poc.gif)

## 🔍 ¿Por qué detectar caracteres invisibles?

Los modelos de IA como GPT, Claude, Llama y otros suelen insertar caracteres invisibles en sus respuestas por varias razones:

- **Procesamiento interno**: Los modelos procesan texto en unidades llamadas "tokens". Al convertir estos tokens de vuelta a texto, a veces se introducen caracteres invisibles como artefactos del proceso.
  
- **Tokenización multisistema**: Para manejar diferentes idiomas y sistemas de escritura, los modelos utilizan marcadores de dirección (RTL/LTR) que pueden quedar en el texto final.
  
- **Formateo de texto**: Al generar texto con formato específico (código, tablas, listas), pueden usar caracteres invisibles para controlar la disposición.
  
- **Control del flujo de texto**: Para evitar que ciertas palabras se rompan o para mantener formatos específicos, los modelos pueden usar caracteres como ZWSP (Zero Width Space).

## 🆕 Novedades v0.3.0 (Noviembre 2025)

### Detección actualizada para modelos razonadores
- **U+202F (Narrow No-Break Space)**: Reportado en modelos o3 y o4-mini de OpenAI (abril 2025)
  - OpenAI indicó que fue un bug de aprendizaje por refuerzo, posiblemente corregido
  - La herramienta ahora lo detecta y documenta
- **30+ caracteres detectables**: Añadidos espacios Unicode tipográficos y variantes de selección

### Nuevas funcionalidades
- 🔬 **Análisis estadístico avanzado**: Densidad, clustering, periodicidad y distribución
- 🤖 **Evaluación de contenido automatizado**: Heurísticas para estimar probabilidad de generación por IA (con disclaimers apropiados)
- 🧹 **Modo de limpieza automática**: Elimina caracteres invisibles preservando emojis
- 📊 **Exportación multi-formato**: TXT, JSON y CSV
- ⚡ **Optimización de rendimiento**: Búsqueda O(1) con Map y caché de análisis
- 📈 **Visualización mejorada**: Estadísticas detalladas y análisis de patrones
- 🗺️ **Heatmap interactivo**: Mapa de calor visual que muestra la distribución de caracteres a lo largo del texto (clickeable para navegar)

## 🚀 Funcionalidades principales

- ✅ Detección de 30+ tipos diferentes de caracteres Unicode invisibles
- ✅ Editor de texto con numeración de líneas y contadores en tiempo real
- ✅ Análisis estadístico de patrones (densidad, clustering, periodicidad)
- ✅ Evaluación heurística de probabilidad de automatización
- ✅ Visualización precisa de posiciones con navegación interactiva
- ✅ Modo de limpieza automática de caracteres invisibles
- ✅ Exportación de informes en múltiples formatos (TXT, JSON, CSV)
- ✅ Caché de análisis para mejor rendimiento
- ✅ Documentación completa con notas sobre cada carácter
- ✅ Interfaz minimalista inspirada en bloc de notas clásico

## 💻 Uso

1. Copie y pegue el texto que desea analizar en el área de texto
2. Haga clic en "Comprobar caracteres invisibles"
3. Examine los resultados detallados y la vista previa con caracteres resaltados
4. Utilice los botones de navegación para saltar a posiciones específicas
5. Descargue o copie el informe completo si es necesario

### 🧪 Probar con ejemplos

¿Quieres probar la herramienta pero no tienes texto con caracteres invisibles? Consulta el archivo **[demo-text.md](demo-text.md)** que contiene 10 ejemplos de texto con diferentes tipos de caracteres invisibles insertados:

- Ejemplo con Zero Width Space (U+200B)
- Ejemplo con Narrow No-Break Space (U+202F) de modelos o3/o4-mini
- Ejemplo con Soft Hyphen (U+00AD)
- Ejemplos con marcas direccionales
- Y más combinaciones realistas

Solo copia cualquier ejemplo y pégalo en el detector para ver cómo funciona.

## 🔎 Caracteres invisibles detectados

### Caracteres prioritarios y nuevos (2025)

| Código | Nombre | Prioridad | Descripción | Notas |
|--------|--------|-----------|-------------|-------|
| **U+202F** | **Narrow No-Break Space** | **Alta** | Espacio estrecho no separable | **NUEVO**: Reportado en o3/o4-mini (abril 2025). OpenAI indicó que fue un bug de RL |
| U+200B | Zero Width Space | Alta | Espacio de ancho cero | Muy común en todos los LLMs |
| U+00A0 | No-Break Space | Alta | Espacio no separable | **NUEVO**: Común en tipografía correcta |
| U+FEFF | Zero Width No-Break Space (BOM) | Alta | Byte Order Mark | Común en problemas de codificación |
| U+202E | Right-to-Left Override | Alta | Fuerza dirección RTL | Usado en ataques de spoofing |
| U+202D | Left-to-Right Override | Alta | Fuerza dirección LTR | Potencial uso en seguridad |

### Lista completa de caracteres detectables

| Código | Nombre | Descripción | Más información |
|--------|--------|-------------|----------------|
| U+200B | Zero Width Space | Espacio de ancho cero. Indica posible división de palabras sin mostrar un espacio visible. | [Wikipedia](https://en.wikipedia.org/wiki/Zero-width_space) |
| U+200C | Zero Width Non-Joiner | Previene la ligadura entre caracteres que normalmente se unirían. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+200D | Zero Width Joiner | Causa la unión de caracteres que normalmente no se ligarían. Usado en emojis compuestos. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+FEFF | Zero Width No-Break Space | También conocido como BOM (Byte Order Mark). Indica orden de bytes en codificaciones. | [Wikipedia](https://en.wikipedia.org/wiki/Byte_order_mark) |
| U+2060 | Word Joiner | Similar al ZWSP pero no indica división de palabras. Previene saltos entre palabras. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+180E | Mongolian Vowel Separator | Separa vocales en escritura mongola tradicional. | [Unicode.org](https://www.unicode.org/charts/PDF/U1800.pdf) |
| U+200E | Left-to-Right Mark | Fuerza dirección de izquierda a derecha para el texto siguiente. | [Wikipedia](https://en.wikipedia.org/wiki/Left-to-right_mark) |
| U+200F | Right-to-Left Mark | Fuerza dirección de derecha a izquierda para el texto siguiente. | [Wikipedia](https://en.wikipedia.org/wiki/Right-to-left_mark) |
| U+202A | Left-to-Right Embedding | Establece un nuevo nivel de incrustación con dirección LTR. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+202B | Right-to-Left Embedding | Establece un nuevo nivel de incrustación con dirección RTL. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+202C | Pop Directional Formatting | Finaliza el último nivel de formato direccional. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+202D | Left-to-Right Override | Fuerza toda la secuencia siguiente a ser tratada como LTR. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+202E | Right-to-Left Override | Fuerza toda la secuencia siguiente a ser tratada como RTL. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+2061 | Function Application | Símbolo matemático invisible que representa la aplicación de funciones. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+2062 | Invisible Times | Representa una multiplicación invisible en notación matemática. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+2063 | Invisible Separator | Separador invisible usado en notación matemática. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+2064 | Invisible Plus | Representa una suma invisible en notación matemática. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+034F | Combining Grapheme Joiner | Une grafemas o unidades visuales en escrituras complejas. | [Unicode.org](https://www.unicode.org/charts/PDF/U0300.pdf) |
| U+061C | Arabic Letter Mark | Controla el comportamiento de texto árabe en entornos bidireccionales. | [Unicode.org](https://www.unicode.org/charts/PDF/U0600.pdf) |
| U+00AD | Soft Hyphen | Guión invisible que solo aparece cuando una palabra debe cortarse al final de línea. | [Wikipedia](https://en.wikipedia.org/wiki/Soft_hyphen) |
| U+2009 | Thin Space | Espacio fino, más estrecho que un espacio normal pero visible. Usado en tipografía para separación precisa. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+00A0 | No-Break Space | Espacio no separable estándar. Muy común en texto bien formateado. | [Wikipedia](https://en.wikipedia.org/wiki/Non-breaking_space) |
| U+202F | Narrow No-Break Space | Espacio estrecho no separable. **Reportado en o3/o4-mini (2025)**. | [Unicode.org](https://www.unicode.org/charts/PDF/U2000.pdf) |
| U+3000 | Ideographic Space | Espacio de ancho completo usado en texto CJK (Chino, Japonés, Coreano). | [Unicode.org](https://www.unicode.org/charts/PDF/U3000.pdf) |
| U+FE0F | Variation Selector-16 | Selecciona variante emoji. Común y generalmente legítimo. | [Unicode.org](https://www.unicode.org/charts/PDF/UFE00.pdf) |
| ... | ... | Y más espacios tipográficos Unicode | ... |

**Total: 30+ caracteres detectables** organizados por categorías (zero-width, space, directional, mathematical, etc.)

## 🔧 Implementación técnica

Este proyecto está implementado utilizando:

- HTML5 para la estructura
- CSS3 para estilos minimalistas en blanco y negro
- JavaScript vanilla para toda la lógica de detección y manipulación

La arquitectura del código sigue un enfoque modular con clara separación de:
- Interfaz de usuario y componentes visuales
- Lógica de detección y análisis de caracteres
- Generación de informes y exportación

## 📦 Instalación

1. Clone este repositorio:
```bash
git clone https://github.com/686f6c61/ai-unicode-detector.git
```

2. Abra `index.html` en su navegador para comenzar a usar la aplicación.

No se requieren dependencias externas ni pasos de compilación.

## 🤔 Casos de uso comunes

- **Desarrollo de software**: Identificar caracteres invisibles en código que pueden causar errores difíciles de depurar
- **Procesamiento de texto**: Limpiar textos generados por IA antes de usarlos en entornos sensibles
- **Seguridad**: Detectar posibles marcas invisibles en textos que podrían indicar su origen
- **Compatibilidad**: Verificar textos antes de insertarlos en sistemas con limitaciones de caracteres
- **Análisis de IA**: Estudiar patrones de inserción de caracteres en diferentes modelos de IA

## 📊 Limitaciones

La detección de caracteres invisibles puede ayudar a identificar contenido generado por IA, pero no es concluyente por sí misma. Otros factores como patrones lingüísticos, estructura del texto y contexto deben considerarse para un análisis completo.

## 🧪 Hallazgos en modelos razonadores (2025)

### U+202F en modelos o3/o4-mini de OpenAI

En abril de 2025, la startup Rumi descubrió que los modelos **o3 y o4-mini** de OpenAI estaban insertando sistemáticamente el carácter U+202F (Narrow No-Break Space) en respuestas largas.

**Cronología:**
- **Descubrimiento**: Abril 2025 por Rumi
- **Patrón**: Principalmente en respuestas largas
- **Modelos afectados**: o3, o4-mini
- **Modelos NO afectados**: GPT-4o, o1

**Respuesta oficial de OpenAI:**
OpenAI contactó a Rumi indicando que los caracteres NO son una marca de agua intencional, sino "una peculiaridad del aprendizaje por refuerzo a gran escala" (RL quirk).

**Estado actual:**
En pruebas recientes, el carácter ya no aparece, sugiriendo que fue corregido.

**Implicaciones:**
- Fácilmente removible (simple find/replace)
- No es un watermark confiable
- Ilustra que los caracteres invisibles pueden ser bugs no intencionales

### Advertencias importantes

⚠️ **NO se puede identificar con certeza qué modelo generó un texto** basándose solo en caracteres invisibles:
- Los modelos cambian constantemente
- Los caracteres pueden venir del post-procesamiento
- Factores externos (navegador, clipboard, OS) pueden introducirlos
- Texto humano también puede contenerlos (editores, tipografía)

✅ **Lo que SÍ se puede hacer:**
- Detectar presencia de caracteres invisibles
- Analizar patrones estadísticos (densidad, clustering)
- Identificar anomalías que *sugieren* automatización
- Limpiar texto antes de uso en sistemas sensibles

## 🔄 Roadmap futuro

- [ ] Procesamiento por chunks para textos muy grandes (Web Workers)
- [x] ~~Visualización con heatmap de distribución~~ ✅ **Implementado en v0.3.0**
- [ ] Detección de más variantes de espacios Unicode
- [ ] Análisis de entropía para detección de steganografía
- [ ] Modo de comparación entre múltiples textos
- [ ] Exportación a más formatos (Markdown, HTML)
- [ ] API REST para integración con otras herramientas
- [ ] Atajos de teclado para acciones principales
- [ ] Modo oscuro/claro

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulte el archivo LICENSE para más detalles.

## 📰 Artículos relacionados

Estos artículos refuerzan la importancia de detectar caracteres Unicode invisibles en texto generado por IA y sus implicaciones de seguridad:

### Ataques y vulnerabilidades (2024-2025)

- [AI chatbots can read and write invisible text, creating an ideal covert channel](https://arstechnica.com/security/2024/10/ai-chatbots-can-read-and-write-invisible-text-creating-an-ideal-covert-channel/) - Ars Technica documenta cómo los LLMs pueden interpretar y generar caracteres invisibles del bloque Tags Unicode, creando canales encubiertos para exfiltrar información sensible.

- [The Invisible Threat: How Zero-Width Unicode Characters Can Silently Backdoor Your AI-Generated Code](https://www.promptfoo.dev/blog/invisible-unicode-threats/) - Análisis sobre cómo caracteres invisibles pueden introducir backdoors en código generado por IA.

- [Phishing attack hides JavaScript using invisible Unicode trick](https://www.bleepingcomputer.com/news/security/phishing-attack-hides-javascript-using-invisible-unicode-trick/) - BleepingComputer reporta ataques de phishing en enero 2025 que utilizan caracteres Hangul invisibles (U+FFA0, U+3164) para ofuscar JavaScript malicioso.

- [Invisible Prompt Injection: A Threat to AI Security](https://www.trendmicro.com/en_us/research/25/a/invisible-prompt-injection-secure-ai.html) - Trend Micro explica cómo atacantes usan caracteres invisibles para manipular respuestas de LLMs de forma encubierta.

### Watermarking y detección (2025)

- [New ChatGPT models seem to leave watermarks on text](https://www.rumidocs.com/newsroom/new-chatgpt-models-seem-to-leave-watermarks-on-text) - Rumi descubre que modelos o3/o4-mini insertan U+202F sistemáticamente. OpenAI confirmó que es un bug de RL, no una marca de agua intencional.

- [OpenAI's New o3/o4-mini Models Add Invisible Characters to Text, Sparking Watermark Debate](https://winbuzzer.com/2025/04/21/openais-new-o3-o4-mini-models-add-invisible-characters-to-text-sparking-watermark-debate-xcxwbn/) - WinBuzzer analiza el debate sobre si los caracteres invisibles son marcas de agua o artefactos no intencionados.

- [Find Invisible Unicode Characters aka "AI Watermarks"](https://clemensjarnach.github.io/02-articles/2025-04-24-article.html) - Guía técnica para detectar y analizar caracteres invisibles en texto de IA.

### Impacto en seguridad

- [Emerging Threat: Invisible Unicode Phishing Attacks](https://blackswan-cybersecurity.com/emerging-threat-invisible-unicode-phishing-attacks/) - Blackswan Cybersecurity documenta cómo atacantes usan Zero-Width Joiners y Soft Hyphens para evadir filtros de seguridad.

- [GPT-4.1 Character Encoding Issues](https://community.openai.com/t/gpt-4-1-character-encoding-issues/1236017) - Discusión en la comunidad de OpenAI sobre problemas de codificación de caracteres en GPT-4.1.

## 👤 Autor

- [686f6c61](https://github.com/686f6c61)
- Twitter: [@hex686f6c61](https://x.com/hex686f6c61)

## 🔗 Enlaces útiles

- [Estándar Unicode](https://unicode.org/)
- [Caracteres de control Unicode](https://en.wikipedia.org/wiki/Unicode_control_characters)
- [Herramientas para desarrolladores Unicode](https://www.unicode.org/resources/developers.html) 