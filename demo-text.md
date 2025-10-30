# Textos de Demostración con Caracteres Invisibles

Este archivo contiene ejemplos de texto con diferentes tipos de caracteres invisibles insertados, para probar el detector.

## Instrucciones de uso

1. Copia cualquiera de los textos de ejemplo a continuación
2. Pégalo en el detector (abre `index.html` en tu navegador)
3. Haz clic en "Comprobar caracteres invisibles"
4. Observa los caracteres detectados y su ubicación

---

## Ejemplo 1: Zero Width Space (U+200B)

Este​ texto​ contiene​ varios​ espacios​ de​ ancho​ cero​ que​ son​ invisibles​ pero​ detectables.​ Copia​ este​ párrafo​ y​ pégalo​ en​ el​ detector​ para​ verlos.

**Caracteres insertados**: Zero Width Space (U+200B) después de cada palabra.

---

## Ejemplo 2: Narrow No-Break Space (U+202F) - Encontrado en o3/o4-mini

Este texto fue generado supuestamente por modelos razonadores modernos de OpenAI. Los caracteres U+202F aparecen en lugares estratégicos del texto, especialmente en respuestas largas.

La inteligencia artificial ha revolucionado la forma en que procesamos información. Estos modelos de lenguaje pueden generar texto coherente y contextualmente relevante. Sin embargo, algunos modelos insertan caracteres especiales durante el proceso de generación.

**Caracteres insertados**: Narrow No-Break Space (U+202F) en varios puntos.

---

## Ejemplo 3: Soft Hyphen (U+00AD)

Este texto con­tiene guio­nes sua­ves que solo apa­recen cuando una pala­bra debe cor­tarse al final de línea. Son invi­sibles en con­diciones nor­males pero están ahí.

**Caracteres insertados**: Soft Hyphen (U+00AD) en medio de palabras.

---

## Ejemplo 4: Marcas direccionales (U+200E y U+200F)

Este texto‎ mezcla‏ marcas‎ de‏ dirección‎ de‏ izquierda‎ a‏ derecha‎ y‏ viceversa.‎ Son‏ comunes‎ en‏ texto‎ multilingüe.‏

**Caracteres insertados**: Left-to-Right Mark (U+200E) y Right-to-Left Mark (U+200F).

---

## Ejemplo 5: Zero Width Joiner (U+200D) - Común en emojis

Los emojis compuestos usan Zero Width Joiner: 👨‍💻 👨‍👩‍👧‍👦 🏳️‍🌈

**Caracteres insertados**: Zero Width Joiner (U+200D) dentro de secuencias de emojis.

---

## Ejemplo 6: Combinación múltiple (Texto realista de IA)

La​ inteligencia artificial ha experimen­tado avances signi­ficativos en los últimos años. Los modelos de lenguaje como GPT‎ y Claude pueden generar texto‏ de alta calidad. Sin embargo, estos sistemas a menudo insertan caracteres Unicode invisibles durante el proceso de tokenización y generación.

Estos caracteres incluyen espacios de ancho cero, guiones suaves, y marcas direccionales. Aunque no son visibles para el usuario final, pueden detectarse con herramientas especializadas. La presencia de estos caracteres puede indicar que el texto fue generado por un modelo de IA, aunque no es una prueba concluyente.

**Caracteres insertados**: Mezcla de U+200B, U+00AD, U+200E, U+200F en un texto que simula salida de IA.

---

## Ejemplo 7: BOM/Zero Width No-Break Space (U+FEFF)

﻿Este texto comienza con un BOM (Byte Order Mark) invisible. Es común en archivos que han sido convertidos entre diferentes codificaciones.

**Caracteres insertados**: Zero Width No-Break Space (U+FEFF) al inicio.

---

## Ejemplo 8: Word Joiner (U+2060)

Este⁠texto⁠usa⁠caracteres⁠Word⁠Joiner⁠para⁠prevenir⁠saltos⁠de⁠línea⁠no⁠deseados.

**Caracteres insertados**: Word Joiner (U+2060) entre palabras.

---

## Ejemplo 9: Caracteres matemáticos invisibles

La fórmula E⁡=⁢m⁢c⁣²⁤ contiene operadores matemáticos invisibles.

**Caracteres insertados**: Function Application (U+2061), Invisible Times (U+2062), Invisible Separator (U+2063), Invisible Plus (U+2064).

---

## Ejemplo 10: El Quijote con caracteres invisibles mixtos

En​ un lugar​ de la Mancha,​ de cuyo nombre​ no quiero​ acordarme,​ no ha mucho tiempo​ que vivía​ un hidalgo​ de los de lanza​ en astillero,​ adarga antigua,​ rocín flaco​ y galgo corredor.​ Una olla​ de algo más vaca​ que carnero,​ salpicón las más noches,​ duelos y quebrantos​ los sábados,​ lantejas los viernes,​ algún palomino​ de añadidura​ los domingos,​ consumían​ las tres partes​ de su hacienda.

El resto​ della concluían​ sayo de velarte,​ calzas de velludo​ para las fiestas,​ con sus pantuflos​ de lo mismo,​ y los días​ de entresemana​ se honraba​ con su vellorí​ de lo más fino.​ Tenía en su casa​ una ama​ que pasaba​ de los cuarenta,​ y una sobrina​ que no llegaba​ a los veinte,​ y un mozo​ de campo y plaza,​ que así ensillaba​ el rocín​ como tomaba​ la podadera.

**Caracteres insertados**: Combinación de U+200B (Zero Width Space), U+202F (Narrow No-Break Space), U+00AD (Soft Hyphen) y U+200E (LTR Mark) distribuidos naturalmente a lo largo del texto.

---

## Ejemplo 11: Texto limpio (sin caracteres invisibles)

Este es un texto completamente normal, sin ningún carácter invisible insertado. Puedes usarlo como control para verificar que el detector funciona correctamente y no genera falsos positivos.

En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.

**Caracteres insertados**: Ninguno (control negativo).

---

## Notas técnicas

### Cómo se insertaron estos caracteres

Estos caracteres fueron insertados manualmente usando sus códigos Unicode:
- `\u200B` para Zero Width Space
- `\u202F` para Narrow No-Break Space
- `\u00AD` para Soft Hyphen
- Y así sucesivamente...

### Preservación de caracteres

Al copiar/pegar este archivo, los caracteres invisibles deberían preservarse. Si no se detectan:

1. Verifica que copiaste desde el archivo fuente MD, no desde una vista renderizada
2. Algunos editores pueden eliminar caracteres invisibles automáticamente
3. Intenta abrir el archivo en modo raw/texto plano

### Crear tus propios ejemplos

Puedes crear tus propios textos de prueba insertando caracteres Unicode:

**En JavaScript**:
```javascript
const text = "Hola\u200BMundo"; // Inserta Zero Width Space
```

**En Python**:
```python
text = "Hola\u200BMundo"  # Inserta Zero Width Space
```

**En editores con soporte Unicode**:
- Sublime Text: Permite insertar caracteres por código
- VS Code: Usa extensiones de Unicode
- Vim: `Ctrl+V u200B` en modo inserción

---

## Casos de uso de estas pruebas

1. **Desarrollo**: Probar que tu detector funciona correctamente
2. **Educación**: Demostrar cómo se ven los caracteres invisibles
3. **Investigación**: Comparar con texto real de diferentes modelos de IA
4. **Calibración**: Ajustar la sensibilidad de herramientas de detección

---

**Última actualización**: Noviembre 2025
**Autor**: 686f6c61
**Repositorio**: https://github.com/686f6c61/ai-unicode-detector
