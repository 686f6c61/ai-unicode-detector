/**
 * Detector de Caracteres Invisibles - Lógica de la aplicación
 * -----------------------------------------------------------
 * Archivo: script.js
 * 
 * Descripción:
 * Este archivo contiene toda la lógica para la detección y análisis de
 * caracteres invisibles en texto. La aplicación detecta múltiples tipos de
 * caracteres Unicode que no tienen representación visual pero que pueden
 * estar presentes en textos, especialmente los generados por modelos de IA.
 * 
 * Funcionalidades principales:
 * - Detección de 20 tipos de caracteres Unicode invisibles
 * - Visualización de caracteres en contexto con posiciones exactas
 * - Conteo de caracteres y palabras en tiempo real
 * - Generación de informes detallados para análisis
 * - Numeración de líneas sincronizada con el texto
 * - Capacidad para guardar y copiar informes completos
 * 
 * Autor: 686f6c61
 * GitHub: https://github.com/686f6c61
 * Fecha: 2025
 */

/**
 * Definición de patrones de caracteres Unicode invisibles a detectar
 * Cada patrón incluye código Unicode, nombre descriptivo, categoría y metadata
 * Actualizado: Enero 2025 con hallazgos de modelos razonadores
 */
const patterns = [
  // NUEVOS - Encontrados en modelos recientes (2025)
  {
    code: '\u202F',
    name: 'Narrow No-Break Space (U+202F)',
    category: 'space',
    priority: 'high',
    note: 'Reportado en modelos o3/o4-mini de OpenAI (abril 2025). OpenAI indicó que fue un bug de RL, posiblemente corregido.',
    year: 2025
  },

  // Espacios de ancho cero y caracteres invisibles comunes
  {
    code: '\u200B',
    name: 'Zero Width Space (U+200B)',
    category: 'zero-width',
    priority: 'high',
    note: 'Muy común en todos los LLMs. Usado para división de palabras invisible.',
    year: 2020
  },
  {
    code: '\u200C',
    name: 'Zero Width Non-Joiner (U+200C)',
    category: 'zero-width',
    priority: 'medium',
    note: 'Previene ligadura entre caracteres.',
    year: 2020
  },
  {
    code: '\u200D',
    name: 'Zero Width Joiner (U+200D)',
    category: 'zero-width',
    priority: 'medium',
    note: 'Necesario para emojis compuestos. No siempre indica IA.',
    year: 2020
  },
  {
    code: '\uFEFF',
    name: 'Zero Width No-Break Space / BOM (U+FEFF)',
    category: 'zero-width',
    priority: 'high',
    note: 'Byte Order Mark. Común en archivos con problemas de codificación.',
    year: 2020
  },
  {
    code: '\u2060',
    name: 'Word Joiner (U+2060)',
    category: 'zero-width',
    priority: 'medium',
    note: 'Previene saltos de línea entre palabras.',
    year: 2020
  },

  // Espacios Unicode visibles pero no estándar
  {
    code: '\u00A0',
    name: 'No-Break Space (U+00A0)',
    category: 'space',
    priority: 'high',
    note: 'Muy común. Espacio no separable usado en tipografía correcta.',
    year: 2020
  },
  {
    code: '\u2009',
    name: 'Thin Space (U+2009)',
    category: 'space',
    priority: 'low',
    note: 'Espacio fino usado en tipografía profesional.',
    year: 2020
  },
  {
    code: '\u2000',
    name: 'En Quad (U+2000)',
    category: 'space',
    priority: 'low',
    note: 'Espacio tipográfico del ancho de "n".',
    year: 2025
  },
  {
    code: '\u2001',
    name: 'Em Quad (U+2001)',
    category: 'space',
    priority: 'low',
    note: 'Espacio tipográfico del ancho de "m".',
    year: 2025
  },
  {
    code: '\u2002',
    name: 'En Space (U+2002)',
    category: 'space',
    priority: 'low',
    note: 'Espacio tipográfico.',
    year: 2025
  },
  {
    code: '\u2003',
    name: 'Em Space (U+2003)',
    category: 'space',
    priority: 'low',
    note: 'Espacio tipográfico.',
    year: 2025
  },
  {
    code: '\u3000',
    name: 'Ideographic Space (U+3000)',
    category: 'space',
    priority: 'medium',
    note: 'Espacio de ancho completo usado en texto CJK (Chino, Japonés, Coreano).',
    year: 2025
  },

  // Marcas direccionales
  {
    code: '\u200E',
    name: 'Left-to-Right Mark (U+200E)',
    category: 'directional',
    priority: 'medium',
    note: 'Control de dirección para texto bidireccional.',
    year: 2020
  },
  {
    code: '\u200F',
    name: 'Right-to-Left Mark (U+200F)',
    category: 'directional',
    priority: 'medium',
    note: 'Control de dirección para texto bidireccional.',
    year: 2020
  },
  {
    code: '\u202A',
    name: 'Left-to-Right Embedding (U+202A)',
    category: 'directional',
    priority: 'medium',
    note: 'Incrustación direccional LTR.',
    year: 2020
  },
  {
    code: '\u202B',
    name: 'Right-to-Left Embedding (U+202B)',
    category: 'directional',
    priority: 'medium',
    note: 'Incrustación direccional RTL.',
    year: 2020
  },
  {
    code: '\u202C',
    name: 'Pop Directional Formatting (U+202C)',
    category: 'directional',
    priority: 'medium',
    note: 'Finaliza formato direccional.',
    year: 2020
  },
  {
    code: '\u202D',
    name: 'Left-to-Right Override (U+202D)',
    category: 'directional',
    priority: 'high',
    note: 'Fuerza dirección LTR. Puede usarse en ataques de seguridad.',
    year: 2020
  },
  {
    code: '\u202E',
    name: 'Right-to-Left Override (U+202E)',
    category: 'directional',
    priority: 'high',
    note: 'Fuerza dirección RTL. Usado en ataques de spoofing de archivos.',
    year: 2020
  },
  {
    code: '\u061C',
    name: 'Arabic Letter Mark (U+061C)',
    category: 'directional',
    priority: 'medium',
    note: 'Control de texto árabe bidireccional.',
    year: 2020
  },

  // Separadores y marcadores especiales
  {
    code: '\u180E',
    name: 'Mongolian Vowel Separator (U+180E)',
    category: 'separator',
    priority: 'low',
    note: 'Usado en escritura mongola tradicional.',
    year: 2020
  },
  {
    code: '\u00AD',
    name: 'Soft Hyphen (U+00AD)',
    category: 'separator',
    priority: 'medium',
    note: 'Guión invisible que aparece solo al romper líneas.',
    year: 2020
  },
  {
    code: '\u034F',
    name: 'Combining Grapheme Joiner (U+034F)',
    category: 'combining',
    priority: 'low',
    note: 'Une grafemas en escrituras complejas.',
    year: 2020
  },

  // Operadores matemáticos invisibles
  {
    code: '\u2061',
    name: 'Function Application (U+2061)',
    category: 'mathematical',
    priority: 'low',
    note: 'Operador matemático invisible.',
    year: 2020
  },
  {
    code: '\u2062',
    name: 'Invisible Times (U+2062)',
    category: 'mathematical',
    priority: 'low',
    note: 'Multiplicación invisible en matemáticas.',
    year: 2020
  },
  {
    code: '\u2063',
    name: 'Invisible Separator (U+2063)',
    category: 'mathematical',
    priority: 'low',
    note: 'Separador invisible matemático.',
    year: 2020
  },
  {
    code: '\u2064',
    name: 'Invisible Plus (U+2064)',
    category: 'mathematical',
    priority: 'low',
    note: 'Suma invisible en matemáticas.',
    year: 2020
  },

  // Variantes de selección
  {
    code: '\uFE0F',
    name: 'Variation Selector-16 (U+FE0F)',
    category: 'variation',
    priority: 'low',
    note: 'Selecciona variante emoji. Común y generalmente legítimo.',
    year: 2025
  }
];

// Crear Map para búsqueda O(1) optimizada
const patternsMap = new Map(patterns.map(p => [p.code, p]));

// Almacena las posiciones de los caracteres invisibles
let invisibleCharPositions = [];
// Variable para almacenar el último informe generado
let lastReport = '';
// Variable para almacenar el último análisis completo
let lastAnalysis = null;
// Caché de análisis (máximo 10 entradas)
const analysisCache = new Map();

/**
 * Inicialización de la aplicación cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos DOM principales
  const textArea = document.getElementById('inputText');
  const charCountElement = document.getElementById('charCount');
  const wordCountElement = document.getElementById('wordCount');
  const lineNumbers = document.getElementById('lineNumbers');
  
  // Inicialización de eventos para botones principales
  document.getElementById('checkBtn').addEventListener('click', checkInvisibleChars);
  document.getElementById('cleanBtn').addEventListener('click', cleanInvisibleChars);
  document.getElementById('helpBtn').addEventListener('click', toggleHelp);
  document.getElementById('demoBtn').addEventListener('click', copyDemoText);
  document.getElementById('clearBtn').addEventListener('click', clearText);
  document.getElementById('downloadBtn').addEventListener('click', downloadReport);
  document.getElementById('copyReportBtn').addEventListener('click', copyReport);
  
  // Manejo del menú desplegable
  const dropdownSpan = document.querySelector('.dropdown span');
  const dropdownContent = document.querySelector('.dropdown-content');
  
  dropdownSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });
  
  // Cerrar dropdown al hacer clic fuera de él
  document.addEventListener('click', () => {
    dropdownContent.style.display = 'none';
  });
  
  // Evitar que clics dentro del dropdown lo cierren
  dropdownContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Crear elemento para notificaciones de copia
  const notification = document.createElement('div');
  notification.classList.add('copy-notification');
  document.body.appendChild(notification);
  
  // Eventos para actualización del contador y numeración de líneas
  textArea.addEventListener('input', () => {
    updateCounts();
    updateLineNumbers();
  });
  
  // Inicializar contadores y numeración
  updateCounts();
  updateLineNumbers();
  
  // Sincronizar scroll entre numeración y textarea
  textArea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = textArea.scrollTop;
  });
  
  // Actualizar numeración al redimensionar ventana
  window.addEventListener('resize', updateLineNumbers);
  
  // Asegurarse de que hay números suficientes al cargar
  setTimeout(updateLineNumbers, 100);
  
  // Inicializar tooltips en la tabla de caracteres
  const rows = document.querySelectorAll('.char-table tr');
  rows.forEach(row => {
    if (row.cells && row.cells[0]) {
      const unicodeCell = row.cells[0];
      if (unicodeCell.textContent.startsWith('U+')) {
        unicodeCell.classList.add('clickable');
        unicodeCell.addEventListener('click', () => {
          navigator.clipboard.writeText(unicodeCell.textContent);
          showNotification(`Código ${unicodeCell.textContent} copiado al portapapeles`);
        });
      }
    }
  });
});

/**
 * Actualiza los contadores de caracteres y palabras
 */
function updateCounts() {
  const text = document.getElementById('inputText').value;
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  document.getElementById('charCount').textContent = charCount;
  document.getElementById('wordCount').textContent = wordCount;
}

/**
 * Actualiza la numeración de líneas en el editor
 * Asegura que haya suficientes números para todas las líneas visibles
 */
function updateLineNumbers() {
  const textArea = document.getElementById('inputText');
  const lineNumbers = document.getElementById('lineNumbers');
  
  // Obtener el contenido del textarea
  const text = textArea.value;
  
  // Asegurarnos de que siempre haya al menos una línea numerada
  let numberOfLines = text.split('\n').length;
  
  // Asegurarnos de que haya suficientes números para llenar la altura visible
  const textAreaHeight = textArea.clientHeight;
  const lineHeight = 21; // Altura aproximada de cada línea en píxeles
  const minLines = Math.ceil(textAreaHeight / lineHeight);
  
  // Usar el mayor valor entre el número de líneas actual y el mínimo necesario
  numberOfLines = Math.max(numberOfLines, minLines);
  
  // Generar los números de línea
  let html = '';
  for (let i = 1; i <= numberOfLines; i++) {
    html += `<div>${i}</div>`;
  }
  lineNumbers.innerHTML = html;
  
  // Asegurar que el scroll esté sincronizado
  lineNumbers.scrollTop = textArea.scrollTop;
}

/**
 * Calcula un hash simple del texto para caché
 */
function quickHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Obtiene la URL de documentación para un carácter Unicode
 * @param {string} charName - Nombre del carácter (ej: "Zero Width Space (U+200B)")
 * @returns {string} URL a la documentación del carácter
 */
function getUnicodeDocUrl(charName) {
  // Extraer código Unicode del nombre
  const match = charName.match(/\(U\+([0-9A-F]+)\)/);
  if (!match) return 'https://unicode.org/';

  const codePoint = match[1];

  // URLs específicas para caracteres comunes
  const specificUrls = {
    '200B': 'https://en.wikipedia.org/wiki/Zero-width_space',
    '200C': 'https://unicode.org/charts/PDF/U2000.pdf',
    '200D': 'https://en.wikipedia.org/wiki/Zero-width_joiner',
    'FEFF': 'https://en.wikipedia.org/wiki/Byte_order_mark',
    '00AD': 'https://en.wikipedia.org/wiki/Soft_hyphen',
    '00A0': 'https://en.wikipedia.org/wiki/Non-breaking_space',
    '202F': 'https://unicode.org/charts/PDF/U2000.pdf',
    '200E': 'https://en.wikipedia.org/wiki/Left-to-right_mark',
    '200F': 'https://en.wikipedia.org/wiki/Right-to-left_mark'
  };

  // Si existe URL específica, usarla
  if (specificUrls[codePoint]) {
    return specificUrls[codePoint];
  }

  // Para el resto, usar tabla Unicode oficial
  // Determinar el rango del carácter para la tabla correcta
  const code = parseInt(codePoint, 16);
  let range;

  if (code >= 0x0000 && code <= 0x007F) range = 'U0000';
  else if (code >= 0x0080 && code <= 0x00FF) range = 'U0000';
  else if (code >= 0x0300 && code <= 0x036F) range = 'U0300';
  else if (code >= 0x0600 && code <= 0x06FF) range = 'U0600';
  else if (code >= 0x1800 && code <= 0x18AF) range = 'U1800';
  else if (code >= 0x2000 && code <= 0x206F) range = 'U2000';
  else if (code >= 0x3000 && code <= 0x303F) range = 'U3000';
  else if (code >= 0xFE00 && code <= 0xFE0F) range = 'UFE00';
  else if (code >= 0xFE70 && code <= 0xFEFF) range = 'UFE70';
  else range = 'U2000'; // Default

  return `https://unicode.org/charts/PDF/${range}.pdf`;
}

/**
 * Analiza patrones estadísticos en las posiciones de caracteres invisibles
 */
function analyzePatterns(positions, textLength) {
  if (positions.length === 0) {
    return {
      density: 0,
      clustering: { clusterCount: 0, avgClusterSize: 0, largestCluster: 0 },
      periodicity: null,
      distribution: 'none'
    };
  }

  // Calcular densidad
  const density = positions.length / textLength;

  // Analizar clustering (caracteres cercanos entre sí)
  const clusters = [];
  let currentCluster = [positions[0]];
  const clusterThreshold = 50; // Distancia máxima para considerar mismo cluster

  for (let i = 1; i < positions.length; i++) {
    if (positions[i].index - positions[i-1].index < clusterThreshold) {
      currentCluster.push(positions[i]);
    } else {
      clusters.push(currentCluster);
      currentCluster = [positions[i]];
    }
  }
  clusters.push(currentCluster);

  const clusterAnalysis = {
    clusterCount: clusters.length,
    avgClusterSize: positions.length / clusters.length,
    largestCluster: Math.max(...clusters.map(c => c.length))
  };

  // Determinar distribución
  let distribution = 'dispersed';
  if (clusterAnalysis.largestCluster > positions.length * 0.5) {
    distribution = 'concentrated';
  } else if (clusterAnalysis.avgClusterSize < 2) {
    distribution = 'uniform';
  }

  // Analizar periodicidad simple
  const intervals = [];
  for (let i = 1; i < positions.length; i++) {
    intervals.push(positions[i].index - positions[i-1].index);
  }

  // Buscar intervalos comunes
  const intervalFreq = new Map();
  intervals.forEach(interval => {
    intervalFreq.set(interval, (intervalFreq.get(interval) || 0) + 1);
  });

  const sortedIntervals = Array.from(intervalFreq.entries())
    .sort((a, b) => b[1] - a[1]);

  const periodicity = sortedIntervals.length > 0 && sortedIntervals[0][1] > 2
    ? { interval: sortedIntervals[0][0], frequency: sortedIntervals[0][1] }
    : null;

  return {
    density,
    clustering: clusterAnalysis,
    periodicity,
    distribution
  };
}

/**
 * Evalúa si el texto podría ser generado automáticamente basándose en heurísticas
 */
function assessAutomationLikelihood(analysis) {
  const signals = [];
  let score = 0;

  // Alta densidad de caracteres invisibles
  if (analysis.patterns.density > 0.002) {
    signals.push('Densidad alta de caracteres invisibles');
    score += 2;
  } else if (analysis.patterns.density > 0.001) {
    signals.push('Densidad moderada de caracteres invisibles');
    score += 1;
  }

  // Patrón periódico sospechoso
  if (analysis.patterns.periodicity && analysis.patterns.periodicity.frequency > 3) {
    signals.push('Patrón periódico detectado');
    score += 2;
  }

  // Concentración inusual
  if (analysis.patterns.distribution === 'concentrated' &&
      analysis.patterns.clustering.largestCluster > 10) {
    signals.push('Concentración inusual de caracteres');
    score += 1;
  }

  // Presencia de U+202F (específico de o3/o4-mini)
  const hasNNBSP = analysis.byCategory.space?.some(c => c.code === '\u202F');
  if (hasNNBSP) {
    signals.push('Contiene U+202F (reportado en modelos o3/o4-mini)');
    score += 2;
  }

  // Múltiples tipos de caracteres diferentes
  const typeCount = Object.keys(analysis.byCategory).length;
  if (typeCount >= 3) {
    signals.push('Múltiples tipos de caracteres invisibles');
    score += 1;
  }

  let likelihood, confidence;
  if (score >= 5) {
    likelihood = 'alta';
    confidence = 'moderada';
  } else if (score >= 3) {
    likelihood = 'moderada';
    confidence = 'baja';
  } else if (score >= 1) {
    likelihood = 'posible';
    confidence = 'muy baja';
  } else {
    likelihood = 'incierta';
    confidence = 'insuficiente';
  }

  return {
    likelihood,
    confidence,
    score,
    signals,
    disclaimer: 'Este análisis es especulativo. Muchos factores pueden causar caracteres invisibles.'
  };
}

/**
 * Analiza el texto en busca de caracteres invisibles con análisis mejorado
 * Muestra resultados y permite navegar a posiciones específicas
 */
function checkInvisibleChars() {
  const textArea = document.getElementById('inputText');
  const text = textArea.value;

  // Verificar caché
  const hash = quickHash(text);
  if (analysisCache.has(hash)) {
    displayResults(analysisCache.get(hash));
    return;
  }

  let total = 0;
  const found = [];
  const byCategory = {};

  // Reiniciar las posiciones
  invisibleCharPositions = [];

  // Analizar cada carácter usando Map optimizado (O(1) lookup)
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const patternMatch = patternsMap.get(char);

    if (patternMatch) {
      // Guardar información sobre el carácter y su posición
      const charInfo = {
        index: i,
        name: patternMatch.name,
        code: patternMatch.code,
        category: patternMatch.category,
        priority: patternMatch.priority,
        note: patternMatch.note,
        codePoint: patternMatch.name.match(/\(U\+([0-9A-F]+)\)/)[1]
      };

      invisibleCharPositions.push(charInfo);

      // Agrupar por categoría
      if (!byCategory[patternMatch.category]) {
        byCategory[patternMatch.category] = [];
      }
      byCategory[patternMatch.category].push(charInfo);

      // Actualizar contadores
      const existingCount = found.find(f => f.name === patternMatch.name);
      if (existingCount) {
        existingCount.count++;
        existingCount.positions.push(i);
      } else {
        found.push({
          name: patternMatch.name,
          priority: patternMatch.priority,
          category: patternMatch.category,
          note: patternMatch.note,
          count: 1,
          positions: [i]
        });
      }

      total++;
    }
  }

  // Realizar análisis de patrones
  const patternAnalysis = analyzePatterns(invisibleCharPositions, text.length);

  // Crear objeto de análisis completo
  const analysis = {
    total,
    found,
    byCategory,
    patterns: patternAnalysis,
    textLength: text.length,
    timestamp: new Date()
  };

  // Añadir evaluación de automatización si se encontraron caracteres
  if (total > 0) {
    analysis.automation = assessAutomationLikelihood(analysis);
  }

  // Guardar en caché
  lastAnalysis = analysis;
  analysisCache.set(hash, analysis);

  // Limitar tamaño del caché
  if (analysisCache.size > 10) {
    const firstKey = analysisCache.keys().next().value;
    analysisCache.delete(firstKey);
  }

  displayResults(analysis);
}

/**
 * Genera y renderiza un heatmap de distribución de caracteres invisibles
 * @param {Array} positions - Array de posiciones de caracteres invisibles
 * @param {number} textLength - Longitud total del texto
 */
function renderHeatmap(positions, textLength) {
  const canvas = document.getElementById('heatmapCanvas');
  const container = document.getElementById('heatmapContainer');

  if (!canvas || positions.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  const ctx = canvas.getContext('2d');

  // Configurar tamaño del canvas
  const containerWidth = canvas.offsetWidth || 760;
  canvas.width = containerWidth;
  canvas.height = 120;

  // Dividir texto en bloques (más pequeños para mejor granularidad)
  const blockSize = 50;
  const numBlocks = Math.ceil(textLength / blockSize);
  const blockWidth = Math.max(canvas.width / numBlocks, 15); // Mínimo 15px por bloque

  // Contar caracteres invisibles por bloque
  const heatmapData = new Array(numBlocks).fill(0);
  positions.forEach(pos => {
    const blockIndex = Math.floor(pos.index / blockSize);
    if (blockIndex < numBlocks) {
      heatmapData[blockIndex]++;
    }
  });

  // Determinar valor máximo para escala
  const maxCount = Math.max(...heatmapData, 1);

  // Renderizar bloques
  heatmapData.forEach((count, i) => {
    const x = i * blockWidth;

    // Determinar color basado en densidad con degradado
    let color;
    let intensity;

    if (count === 0) {
      color = '#e8e8e8'; // Gris muy claro - ninguno
    } else if (count === 1) {
      color = '#fff59d'; // Amarillo claro
      intensity = 0.3;
    } else if (count === 2) {
      color = '#ffeb3b'; // Amarillo
      intensity = 0.5;
    } else if (count <= 3) {
      color = '#ffc107'; // Amarillo oscuro
      intensity = 0.6;
    } else if (count <= 5) {
      color = '#ff9800'; // Naranja
      intensity = 0.75;
    } else if (count <= 8) {
      color = '#ff5722'; // Naranja-rojo
      intensity = 0.85;
    } else {
      color = '#d32f2f'; // Rojo oscuro - muy alto
      intensity = 1;
    }

    // Dibujar bloque con sombra para profundidad
    ctx.fillStyle = color;
    ctx.fillRect(x, 10, blockWidth - 2, canvas.height - 20);

    // Añadir borde negro para separación clara
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, 10, blockWidth - 2, canvas.height - 20);

    // Añadir número grande si hay caracteres y el bloque es suficientemente ancho
    if (count > 0 && blockWidth > 20) {
      ctx.fillStyle = count > 5 ? '#fff' : '#000';
      ctx.font = `bold ${Math.min(14, blockWidth / 3)}px Consolas, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(count, x + blockWidth / 2, canvas.height / 2);
    }

    // Añadir indicador de posición en la parte superior
    if (i % 5 === 0) {
      ctx.fillStyle = '#666';
      ctx.font = '9px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * blockSize}`, x + blockWidth / 2, 8);
    }
  });

  // Hacer el canvas interactivo
  canvas.onclick = function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const blockIndex = Math.floor((x / canvas.width) * numBlocks);
    const startPos = blockIndex * blockSize;
    const endPos = Math.min((blockIndex + 1) * blockSize, textLength);

    // Resaltar el bloque en el textarea
    const textArea = document.getElementById('inputText');
    textArea.focus();
    textArea.setSelectionRange(startPos, endPos);
    textArea.scrollTop = (startPos / textLength) * textArea.scrollHeight;

    showNotification(`Bloque ${blockIndex + 1}: caracteres ${startPos}-${endPos} (${heatmapData[blockIndex]} invisibles)`);
  };

  canvas.style.cursor = 'pointer';
}

/**
 * Muestra los resultados del análisis en la UI
 */
function displayResults(analysis) {
  const { total, found, patterns: patternAnalysis, automation } = analysis;

  const textArea = document.getElementById('inputText');
  const text = textArea.value;
  const resultArea = document.getElementById('resultArea');
  const previewArea = document.getElementById('previewArea');
  resultArea.innerHTML = '';
  previewArea.innerHTML = '';

  if (total === 0) {
    resultArea.textContent = '✅ No se encontraron caracteres invisibles.';
    lastReport = generateReport(analysis);
    // Ocultar heatmap si no hay caracteres
    document.getElementById('heatmapContainer').style.display = 'none';
  } else {
    // Renderizar heatmap
    renderHeatmap(invisibleCharPositions, text.length);
    // Título principal con estadísticas
    const statsDiv = document.createElement('div');
    statsDiv.className = 'analysis-stats';
    statsDiv.innerHTML = `
      <strong>⚠️ Se han detectado ${total} caracteres invisibles</strong>
      <div class="stats-detail">
        <span>Densidad: ${(patternAnalysis.density * 100).toFixed(4)}%</span>
        <span>Distribución: ${patternAnalysis.distribution}</span>
        ${patternAnalysis.periodicity ? `<span>Patrón periódico cada ~${patternAnalysis.periodicity.interval} caracteres</span>` : ''}
      </div>
    `;
    resultArea.appendChild(statsDiv);

    // Análisis de automatización si está disponible
    if (automation) {
      const automationDiv = document.createElement('div');
      automationDiv.className = `automation-assessment ${automation.likelihood}`;
      automationDiv.innerHTML = `
        <strong>📊 Evaluación de contenido automatizado:</strong>
        <div class="automation-details">
          <div>Probabilidad: <span class="likelihood-${automation.likelihood}">${automation.likelihood}</span> (confianza: ${automation.confidence})</div>
          ${automation.signals.length > 0 ? `
            <div class="signals">Señales detectadas:
              <ul>${automation.signals.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          ` : ''}
          <div class="disclaimer">⚠️ ${automation.disclaimer}</div>
        </div>
      `;
      resultArea.appendChild(automationDiv);
    }
    const ul = document.createElement('ul');
    found.forEach(item => {
      const li = document.createElement('li');

      // Crear enlace para cada tipo de carácter invisible
      const charNameLink = document.createElement('a');
      charNameLink.textContent = `${item.name}`;
      charNameLink.classList.add('char-name');
      charNameLink.href = getUnicodeDocUrl(item.name);
      charNameLink.target = '_blank';
      charNameLink.rel = 'noopener noreferrer';
      charNameLink.title = `Ver documentación de ${item.name}`;
      li.appendChild(charNameLink);

      // Añadir contador
      const countSpan = document.createElement('span');
      countSpan.textContent = `: ${item.count} ${item.count === 1 ? 'vez' : 'veces'} `;
      li.appendChild(countSpan);
      
      // Añadir indicadores de posición para cada ocurrencia
      item.positions.forEach((pos, idx) => {
        const posButton = document.createElement('button');
        posButton.textContent = `#${idx+1}`;
        posButton.classList.add('position-button');
        posButton.setAttribute('data-position', pos);
        posButton.setAttribute('title', `Ir a la posición ${pos} en el texto`);
        
        // Evento para saltar a la posición en el texto
        posButton.addEventListener('click', () => {
          highlightPositionInText(pos);
        });
        
        li.appendChild(posButton);
        
        // Separador si no es el último
        if (idx < item.positions.length - 1) {
          li.appendChild(document.createTextNode(' '));
        }
      });
      
      ul.appendChild(li);
    });
    
    resultArea.innerHTML = `<strong>⚠️ Se han detectado ${total} caracteres invisibles:</strong>`;
    resultArea.appendChild(ul);

    // Renderizar la vista previa con los caracteres marcados
    const html = Array.from(text).map((ch, index) => {
      const pat = patterns.find(p => p.code === ch);
      if (pat) {
        // Extraer el código Unicode para mostrarlo
        const codePoint = pat.name.match(/\(U\+([0-9A-F]+)\)/)[1];
        return `<mark class="highlight" title="${pat.name}" data-position="${index}" data-code="${codePoint}">U+${codePoint}</mark>`;
      }
      return ch.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }).join('');
    previewArea.innerHTML = html;
    
    // Hacer que los caracteres marcados sean interactivos
    const highlightedChars = previewArea.querySelectorAll('.highlight');
    highlightedChars.forEach(el => {
      el.addEventListener('click', () => {
        const position = parseInt(el.getAttribute('data-position'), 10);
        highlightPositionInText(position);
      });
    });
    
    // Generar informe completo
    lastReport = generateReport(analysis);
  }
}

/**
 * Limpia caracteres invisibles del texto
 */
function cleanInvisibleChars() {
  const textArea = document.getElementById('inputText');
  const text = textArea.value;

  if (!text) {
    showNotification('No hay texto para limpiar');
    return;
  }

  let cleaned = text;
  let removedCount = 0;
  const removedTypes = new Set();

  // Eliminar caracteres invisibles excepto ZWJ (necesario para emojis)
  patterns.forEach(pattern => {
    // Preservar ZWJ para emojis compuestos
    if (pattern.code === '\u200D') return;

    const regex = new RegExp(pattern.code, 'g');
    const matches = (cleaned.match(regex) || []).length;

    if (matches > 0) {
      cleaned = cleaned.replace(regex, '');
      removedCount += matches;
      removedTypes.add(pattern.name);
    }
  });

  if (removedCount > 0) {
    textArea.value = cleaned;
    updateCounts();
    updateLineNumbers();

    showNotification(`✓ Se eliminaron ${removedCount} caracteres invisibles de ${removedTypes.size} tipos diferentes`);

    // Limpiar resultados previos
    document.getElementById('resultArea').innerHTML = '';
    document.getElementById('previewArea').innerHTML = '';
    invisibleCharPositions = [];
    lastReport = '';
  } else {
    showNotification('No se encontraron caracteres invisibles para eliminar');
  }
}

/**
 * Resalta y muestra un carácter invisible en el textarea
 * @param {number} position - Posición del carácter en el texto
 */
function highlightPositionInText(position) {
  const textArea = document.getElementById('inputText');
  const text = textArea.value;
  
  // Asegurarse de que la posición es válida
  if (position >= 0 && position < text.length) {
    // Calcular la línea y columna para el scroll
    const textUpToPosition = text.substring(0, position);
    const lines = textUpToPosition.split('\n');
    const lineNumber = lines.length - 1;
    
    // Encontrar los límites de la palabra que contiene el carácter invisible
    // Limitamos la selección a un máximo de 20 caracteres para evitar seleccionar demasiado texto
    const maxWordLength = 20;
    
    let startPos = Math.max(0, position - maxWordLength/2);
    let endPos = Math.min(text.length, position + 1 + maxWordLength/2);
    
    // Ajustar startPos y endPos para no cortar palabras
    // Buscar hacia atrás hasta encontrar un espacio o inicio del texto
    while (startPos > 0 && !/\s/.test(text.charAt(startPos-1))) {
      startPos--;
    }
    
    // Buscar hacia adelante hasta encontrar un espacio o fin del texto
    while (endPos < text.length && !/\s/.test(text.charAt(endPos))) {
      endPos++;
    }
    
    // Si la selección es demasiado grande, limitarla a los caracteres alrededor de la posición
    if (endPos - startPos > maxWordLength) {
      startPos = Math.max(0, position - 5);
      endPos = Math.min(text.length, position + 6);
    }
    
    // Hacer que el textarea tenga el foco
    textArea.focus();
    
    // Seleccionar la palabra o fragmento que contiene el carácter invisible
    textArea.setSelectionRange(startPos, endPos);
    
    // Aplicar efecto visual con animación
    textArea.classList.add('flash-selection');
    setTimeout(() => {
      textArea.classList.remove('flash-selection');
      
      // Posicionar el cursor justo después del carácter invisible después de la animación
      textArea.setSelectionRange(position + 1, position + 1);
    }, 1500);
    
    // Calcular posición para scroll (aproximada ya que no hay acceso directo a líneas)
    const lineHeight = 21; // Altura aproximada de línea en píxeles
    const scrollPosition = lineNumber * lineHeight;
    textArea.scrollTop = scrollPosition;
    
    // Actualizar números de línea para la posición de scroll
    document.getElementById('lineNumbers').scrollTop = textArea.scrollTop;
  }
}

/**
 * Muestra u oculta la sección de ayuda
 */
function toggleHelp() {
  const help = document.getElementById('helpArea');
  help.style.display = help.style.display === 'block' ? 'none' : 'block';
}

/**
 * Copia texto de demostración con caracteres invisibles al portapapeles
 * Incluye múltiples tipos de caracteres invisibles para una demostración completa
 */
function copyDemoText() {
  // Texto del Quijote con variedad de caracteres invisibles insertados:
  // U+200B (Zero Width Space), U+202F (Narrow No-Break Space),
  // U+00AD (Soft Hyphen), U+200E (LTR Mark), U+200F (RTL Mark)
  // U+FEFF (BOM), U+2060 (Word Joiner)
  const demoText = `﻿En​ un lugar de la Mancha, de cuyo nombre no quiero acor­darme, no ha mucho tiempo que vivía un hidalgo de los de lanza en asti­llero, adarga anti­gua, rocín flaco y galgo corre­dor. Una olla de algo más vaca que car­nero, salpicón las más noches, duelos y que­brantos los sába­dos, lan­tejas los viernes, algún palo­mino de aña­didura los domin­gos, consu­mían las tres partes de su hacienda.

El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantu­flos de lo mismo, y los días de entre­semana se hon­raba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cua­renta, y una sobrina que no lle­gaba a los veinte, y un mozo de campo⁠ y plaza, que así ensi­llaba el rocín como tomaba la poda­dera.

Frisaba‎ la edad‏ de nuestro‎ hidalgo‏ con los cin­cuenta años; era de com­plexión recia, seco de carnes, enjuto de ros­tro, gran madru­gador y amigo de la caza. Quieren decir que tenía el sobre­nombre de Qui­jada, o Que­sada, que en esto hay alguna dife­rencia en los auto­res que deste caso escri­ben; aunque por con­jeturas vero­símiles se deja enten­der que se lla­maba Que­jana.

Pero esto importa poco a nuestro cuento; basta que en la narra­ción dél no se salga un punto de la ver­dad. Es, pues, de saber que este sobre­dicho hidalgo, los ratos que estaba ocioso, que eran los más del año, se daba a leer libros de caba­llerías, con tanta afición y gusto, que olvidó casi de todo punto el ejer­cicio de la caza, y aun la admi­nistra­ción de su hacienda.`;

  // Copiar al portapapeles
  navigator.clipboard.writeText(demoText)
    .then(() => {
      showNotification('✓ Texto DEMO copiado (contiene U+200B, U+202F, U+00AD, U+200E, U+200F, U+FEFF, U+2060). Pégalo en el editor.');
    })
    .catch(err => {
      // Fallback: pegar directamente en el textarea
      document.getElementById('inputText').value = demoText;
      updateCounts();
      updateLineNumbers();
      showNotification('✓ Texto DEMO insertado. Contiene múltiples tipos de caracteres invisibles. Haz clic en "Comprobar".');
    });
}

/**
 * Limpia el texto y los resultados
 */
function clearText() {
  document.getElementById('inputText').value = '';
  document.getElementById('resultArea').innerHTML = '';
  document.getElementById('previewArea').innerHTML = '';
  updateCounts();
  updateLineNumbers();
  invisibleCharPositions = [];
  lastReport = '';
}

/**
 * Genera un informe completo en el formato especificado
 * @param {Object} analysis - Objeto de análisis completo
 * @param {string} format - Formato del informe ('txt', 'json', 'csv')
 * @returns {string} Informe en el formato solicitado
 */
function generateReport(analysis, format = 'txt') {
  const text = document.getElementById('inputText').value;

  if (format === 'json') {
    return generateJSONReport(analysis, text);
  } else if (format === 'csv') {
    return generateCSVReport(analysis, text);
  } else {
    return generateTXTReport(analysis, text);
  }
}

/**
 * Genera informe en formato TXT
 */
function generateTXTReport(analysis, text) {
  let reportContent = 'INFORME DE DETECCIÓN DE CARACTERES INVISIBLES\n';
  reportContent += '='.repeat(70) + '\n\n';

  // Metadata
  reportContent += `Fecha: ${new Date().toLocaleDateString()}\n`;
  reportContent += `Hora: ${new Date().toLocaleTimeString()}\n`;
  reportContent += `Versión: 0.3.0 (Enero 2025)\n\n`;

  // Estadísticas básicas
  reportContent += 'ESTADÍSTICAS DEL TEXTO\n';
  reportContent += '-'.repeat(70) + '\n';
  reportContent += `Total de caracteres: ${text.length}\n`;
  reportContent += `Total de palabras: ${text.trim() === '' ? 0 : text.trim().split(/\s+/).length}\n\n`;

  // Resultados de detección
  if (!analysis || analysis.total === 0) {
    reportContent += 'RESULTADO: No se encontraron caracteres invisibles.\n';
  } else {
    reportContent += `CARACTERES INVISIBLES DETECTADOS: ${analysis.total}\n`;
    reportContent += '-'.repeat(70) + '\n\n';

    // Análisis de patrones
    reportContent += 'ANÁLISIS DE PATRONES\n';
    reportContent += `Densidad: ${(analysis.patterns.density * 100).toFixed(4)}%\n`;
    reportContent += `Distribución: ${analysis.patterns.distribution}\n`;
    reportContent += `Clusters detectados: ${analysis.patterns.clustering.clusterCount}\n`;
    reportContent += `Tamaño promedio de cluster: ${analysis.patterns.clustering.avgClusterSize.toFixed(2)}\n`;
    if (analysis.patterns.periodicity) {
      reportContent += `Patrón periódico: Cada ~${analysis.patterns.periodicity.interval} caracteres (${analysis.patterns.periodicity.frequency} veces)\n`;
    }
    reportContent += '\n';

    // Evaluación de automatización
    if (analysis.automation) {
      reportContent += 'EVALUACIÓN DE CONTENIDO AUTOMATIZADO\n';
      reportContent += '-'.repeat(70) + '\n';
      reportContent += `Probabilidad: ${analysis.automation.likelihood}\n`;
      reportContent += `Confianza: ${analysis.automation.confidence}\n`;
      reportContent += `Score: ${analysis.automation.score}/10\n`;
      if (analysis.automation.signals.length > 0) {
        reportContent += '\nSeñales detectadas:\n';
        analysis.automation.signals.forEach((signal, i) => {
          reportContent += `  ${i + 1}. ${signal}\n`;
        });
      }
      reportContent += `\n⚠️  ADVERTENCIA: ${analysis.automation.disclaimer}\n\n`;
    }

    // Desglose por categoría
    reportContent += 'CARACTERES POR CATEGORÍA\n';
    reportContent += '-'.repeat(70) + '\n';
    Object.entries(analysis.byCategory).forEach(([category, chars]) => {
      reportContent += `\n${category.toUpperCase()} (${chars.length} encontrados):\n`;
      const grouped = {};
      chars.forEach(c => {
        if (!grouped[c.name]) grouped[c.name] = 0;
        grouped[c.name]++;
      });
      Object.entries(grouped).forEach(([name, count]) => {
        reportContent += `  - ${name}: ${count}\n`;
      });
    });
    reportContent += '\n';

    // Detalles de posiciones (primeras 20)
    reportContent += 'DETALLES DE POSICIONES (primeras 20)\n';
    reportContent += '-'.repeat(70) + '\n';
    invisibleCharPositions.slice(0, 20).forEach((char, index) => {
      const position = char.index;
      const start = Math.max(0, position - 15);
      const end = Math.min(text.length, position + 15);
      const before = text.substring(start, position).replace(/\n/g, ' ');
      const after = text.substring(position + 1, end).replace(/\n/g, ' ');

      reportContent += `\n[${index + 1}] ${char.name} en posición ${position}\n`;
      if (char.note) {
        reportContent += `    Info: ${char.note}\n`;
      }
      reportContent += `    Contexto: "...${before}[▪]${after}..."\n`;
    });

    if (invisibleCharPositions.length > 20) {
      reportContent += `\n... y ${invisibleCharPositions.length - 20} más.\n`;
    }
  }

  reportContent += '\n' + '='.repeat(70) + '\n';
  reportContent += 'Generado por Detector de Caracteres Invisibles v0.3.0\n';
  reportContent += 'https://github.com/686f6c61/artificial-intelligence-text-detector-unicode\n';

  return reportContent;
}

/**
 * Genera informe en formato JSON
 */
function generateJSONReport(analysis, text) {
  const report = {
    metadata: {
      version: '0.3.0',
      timestamp: new Date().toISOString(),
      generator: 'artificial-intelligence-text-detector-unicode'
    },
    textStats: {
      totalCharacters: text.length,
      totalWords: text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    },
    analysis: analysis || { total: 0 }
  };

  return JSON.stringify(report, null, 2);
}

/**
 * Genera informe en formato CSV
 */
function generateCSVReport(analysis, text) {
  if (!analysis || analysis.total === 0) {
    return 'No se encontraron caracteres invisibles';
  }

  let csv = 'Posición,Código Unicode,Nombre,Categoría,Prioridad,Contexto Antes,Contexto Después\n';

  invisibleCharPositions.forEach(char => {
    const position = char.index;
    const start = Math.max(0, position - 10);
    const end = Math.min(text.length, position + 10);
    const before = text.substring(start, position).replace(/"/g, '""').replace(/\n/g, ' ');
    const after = text.substring(position + 1, end).replace(/"/g, '""').replace(/\n/g, ' ');

    csv += `${position},${char.codePoint},"${char.name}",${char.category},${char.priority},"${before}","${after}"\n`;
  });

  return csv;
}

/**
 * Descarga el informe en el formato seleccionado
 */
function downloadReport() {
  // Si no hay análisis generado, ejecutar la detección primero
  if (!lastAnalysis) {
    checkInvisibleChars();
    // Esperar a que se complete
    setTimeout(downloadReport, 100);
    return;
  }

  const format = document.getElementById('exportFormat').value;
  const report = generateReport(lastAnalysis, format);

  // Determinar tipo MIME y extensión
  let mimeType, extension;
  switch (format) {
    case 'json':
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'csv':
      mimeType = 'text/csv';
      extension = 'csv';
      break;
    default:
      mimeType = 'text/plain';
      extension = 'txt';
  }

  // Crear archivo y descargarlo
  const blob = new Blob([report], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `informe_caracteres_invisibles.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showNotification(`Informe descargado en formato ${format.toUpperCase()}`);
}

/**
 * Copia el informe al portapapeles en el formato seleccionado
 */
function copyReport() {
  // Si no hay análisis generado, ejecutar la detección primero
  if (!lastAnalysis) {
    checkInvisibleChars();
    setTimeout(copyReport, 100);
    return;
  }

  const format = document.getElementById('exportFormat').value;
  const report = generateReport(lastAnalysis, format);

  // Copiar al portapapeles
  navigator.clipboard.writeText(report)
    .then(() => {
      showNotification(`Informe copiado al portapapeles en formato ${format.toUpperCase()}`);
    })
    .catch(err => {
      showNotification('Error al copiar: ' + err);
    });
}

/**
 * Muestra una notificación temporal
 * @param {string} message - Mensaje a mostrar
 */
function showNotification(message) {
  const notification = document.querySelector('.copy-notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
} 
