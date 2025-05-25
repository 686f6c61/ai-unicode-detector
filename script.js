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
 * Fecha: Abril 2025
 */

/**
 * Definición de patrones de caracteres Unicode invisibles a detectar
 * Cada patrón incluye código Unicode y nombre descriptivo
 */
const patterns = [
  { code: '\u200B', name: 'Zero Width Space (U+200B)' },
  { code: '\u200C', name: 'Zero Width Non-Joiner (U+200C)' },
  { code: '\u200D', name: 'Zero Width Joiner (U+200D)' },
  { code: '\uFEFF', name: 'Zero Width No-Break Space (U+FEFF)' },
  { code: '\u2060', name: 'Word Joiner (U+2060)' },
  { code: '\u180E', name: 'Mongolian Vowel Separator (U+180E)' },
  { code: '\u200E', name: 'Left-to-Right Mark (U+200E)' },
  { code: '\u200F', name: 'Right-to-Left Mark (U+200F)' },
  { code: '\u202A', name: 'Left-to-Right Embedding (U+202A)' },
  { code: '\u202B', name: 'Right-to-Left Embedding (U+202B)' },
  { code: '\u202C', name: 'Pop Directional Formatting (U+202C)' },
  { code: '\u202D', name: 'Left-to-Right Override (U+202D)' },
  { code: '\u202E', name: 'Right-to-Left Override (U+202E)' },
  { code: '\u2061', name: 'Function Application (U+2061)' },
  { code: '\u2062', name: 'Invisible Times (U+2062)' },
  { code: '\u2063', name: 'Invisible Separator (U+2063)' },
  { code: '\u2064', name: 'Invisible Plus (U+2064)' },
  { code: '\u034F', name: 'Combining Grapheme Joiner (U+034F)' },
  { code: '\u061C', name: 'Arabic Letter Mark (U+061C)' },
  { code: '\u00AD', name: 'Soft Hyphen (U+00AD)' },
  { code: '\u2009', name: 'Thin Space (U+2009)' }
];

// Almacena las posiciones de los caracteres invisibles
let invisibleCharPositions = [];
// Variable para almacenar el último informe generado
let lastReport = '';

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
  document.getElementById('helpBtn').addEventListener('click', toggleHelp);
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
 * Analiza el texto en busca de caracteres invisibles
 * Muestra resultados y permite navegar a posiciones específicas
 */
function checkInvisibleChars() {
  const textArea = document.getElementById('inputText');
  const text = textArea.value;
  let total = 0;
  const found = [];
  
  // Reiniciar las posiciones
  invisibleCharPositions = [];

  // Analizar cada carácter para encontrar invisibles y sus posiciones
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const patternMatch = patterns.find(p => p.code === char);
    
    if (patternMatch) {
      // Guardar información sobre el carácter y su posición
      const charInfo = {
        index: i,
        name: patternMatch.name,
        code: patternMatch.code,
        codePoint: patternMatch.name.match(/\(U\+([0-9A-F]+)\)/)[1]
      };
      
      invisibleCharPositions.push(charInfo);
      
      // Actualizar contadores
      const existingCount = found.find(f => f.name === patternMatch.name);
      if (existingCount) {
        existingCount.count++;
        existingCount.positions.push(i);
      } else {
        found.push({ 
          name: patternMatch.name, 
          count: 1,
          positions: [i]
        });
      }
      
      total++;
    }
  }

  const resultArea = document.getElementById('resultArea');
  const previewArea = document.getElementById('previewArea');
  resultArea.innerHTML = '';
  previewArea.innerHTML = '';

  if (total === 0) {
    resultArea.textContent = '✅ No se encontraron caracteres invisibles.';
    lastReport = generateReport(false); // Generar informe sin caracteres encontrados
  } else {
    const ul = document.createElement('ul');
    found.forEach(item => {
      const li = document.createElement('li');
      
      // Crear elemento para cada tipo de carácter invisible
    const charNameSpan = document.createElement('span');
    charNameSpan.textContent = `${item.name}: ${item.count} ${item.count === 1 ? 'vez' : 'veces'} `;
    charNameSpan.classList.add('char-name');
    li.appendChild(charNameSpan);
      
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
    lastReport = generateReport(true);
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
 * Genera un informe completo en formato texto
 * @param {boolean} charsFound - Indica si se encontraron caracteres invisibles
 * @returns {string} Informe completo en formato texto
 */
function generateReport(charsFound) {
  const text = document.getElementById('inputText').value;
  let reportContent = 'INFORME DE DETECCIÓN DE CARACTERES INVISIBLES\n';
  reportContent += '=============================================\n\n';
  
  // Añadir fecha y hora
  reportContent += `Fecha: ${new Date().toLocaleDateString()}\n`;
  reportContent += `Hora: ${new Date().toLocaleTimeString()}\n\n`;
  
  // Añadir estadísticas
  reportContent += `Total de caracteres: ${text.length}\n`;
  reportContent += `Total de palabras: ${text.trim() === '' ? 0 : text.trim().split(/\s+/).length}\n\n`;
  
  // Añadir información sobre caracteres invisibles
  if (!charsFound || invisibleCharPositions.length === 0) {
    reportContent += 'No se encontraron caracteres invisibles en el texto.\n';
  } else {
    reportContent += `Se encontraron ${invisibleCharPositions.length} caracteres invisibles:\n\n`;
    
    // Agrupar por tipo de carácter
    const characterCounts = {};
    invisibleCharPositions.forEach(char => {
      if (characterCounts[char.name]) {
        characterCounts[char.name]++;
      } else {
        characterCounts[char.name] = 1;
      }
    });
    
    // Añadir conteo por tipo
  Object.keys(characterCounts).forEach(charName => {
  reportContent += `- ${charName}: ${characterCounts[charName]} veces\n`;
    });
    
    // Añadir extractos de texto con caracteres invisibles
    reportContent += '\nExtracciones de contexto:\n';
    invisibleCharPositions.forEach((char, index) => {
      const position = char.index;
      const start = Math.max(0, position - 20);
      const end = Math.min(text.length, position + 20);
      const before = text.substring(start, position).replace(/\n/g, ' ');
      const after = text.substring(position + 1, end).replace(/\n/g, ' ');
      
      reportContent += `\n[${index + 1}] ${char.name} encontrado en posición ${position}:\n`;
      reportContent += `"...${before}[INVISIBLE CHAR]${after}..."\n`;
    });
  }
  
  reportContent += '\n=============================================\n';
  reportContent += 'Generado por Detector de Caracteres Invisibles\n';
  reportContent += 'https://github.com/686f6c61/artificial-intelligence-text-detector-unicode';
  
  return reportContent;
}

/**
 * Descarga el informe como archivo de texto
 */
function downloadReport() {
  // Si no hay informe generado, ejecutar la detección primero
  if (!lastReport) {
    checkInvisibleChars();
  }
  
  // Crear archivo y descargarlo
  const blob = new Blob([lastReport], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'informe_caracteres_invisibles.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copia el informe al portapapeles
 */
function copyReport() {
  // Si no hay informe generado, ejecutar la detección primero
  if (!lastReport) {
    checkInvisibleChars();
  }
  
  // Copiar al portapapeles
  navigator.clipboard.writeText(lastReport)
    .then(() => {
      showNotification('Informe copiado al portapapeles');
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
