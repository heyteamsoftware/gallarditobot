# Manual interno · Configuración de GallarditoBot en WordPress

Guía para volver a dejar el chatbot funcionando en la web del CIFP Tony Gallardo
(WordPress de Medusa/edublog) si hay que reconfigurarlo desde cero.

> ⚠️ Este archivo está en un repositorio **público**. NO escribas aquí contraseñas
> ni claves de administrador. Los datos sensibles se guardan aparte (ver §7).

---

## 1. Cómo funciona (arquitectura)

- El bot **no se aloja en WordPress**. Se aloja en **GitHub Pages** y WordPress
  solo lo **incrusta** con un iframe (plugin **Advanced iFrame**).
- Motivo: el WordPress de Medusa es multisitio y **censura `<script>`/`<style>`**
  en los bloques HTML, así que no se puede pegar el bot directamente.
- Ventaja: para cambiar el bot solo hay que hacer `git push`; la web se actualiza
  sola (GitHub Pages sirve desde la rama `main`). No hay que tocar WordPress salvo
  en la configuración inicial descrita aquí.

Esquema:

```
Navegante  →  Web WordPress  →  (Advanced iFrame)  →  iframe: embed.html (GitHub Pages)
                                                        └─ carga gallarditobot.js (lógica + datos)
```

---

## 2. URLs importantes

- Repositorio: https://github.com/heyteamsoftware/gallarditobot
- Bot embebible (iframe): https://heyteamsoftware.github.io/gallarditobot/embed.html
- Bot versión completa: https://heyteamsoftware.github.io/gallarditobot/gallarditobot.html
- CSS de posición: https://heyteamsoftware.github.io/gallarditobot/gb-iframe.css
- Contador visitas (consulta): https://abacus.jasoncameron.dev/get/cifptonygallardo/visitas2026
- Contador consultas (consulta): https://abacus.jasoncameron.dev/get/cifptonygallardo/consultas2026

---

## 3. Requisitos previos en WordPress

1. Acceso al escritorio de WordPress con rol de administrador del sitio.
2. Plugin **Advanced iFrame** instalado y **activado**
   (Plugins → Advanced iFrame → Activar).

---

## 4. Configuración paso a paso

### 4.1. Colocar el bot con un widget "Shortcode"

1. Ir a **Apariencia → Widgets**.
2. Elegir un área que se muestre en las páginas (p. ej. **Barra lateral** o un
   **Pie de página**). Como el bot flota fijo en la esquina, el área concreta da igual.
3. Añadir un bloque **"Shortcode"** (NO "HTML personalizado": ese censura el código).
4. Pegar exactamente este shortcode:

   ```
   [advanced_iframe src="https://heyteamsoftware.github.io/gallarditobot/embed.html" width="400" height="650" scrolling="no" frameborder="0" transparency="true"]
   ```

5. Pulsar **Actualizar**.

### 4.2. Fijar el iframe en la esquina inferior derecha

1. Ir a **Advanced iFrame** (menú lateral) → pestaña **"Add/Include files"**.
2. En el campo **"Additional css"** pegar esta URL (debe terminar en `.css`,
   sin `?v=` ni parámetros):

   ```
   https://heyteamsoftware.github.io/gallarditobot/gb-iframe.css
   ```

3. Comprobar que el campo **"Add css styles to parent"** (pestaña *Advanced Settings*
   → *Modify the parent page*) está **vacío** (para que no pelee con el archivo CSS).
4. Pulsar **"Update Settings"**.

> El archivo `gb-iframe.css` fija el iframe con `position:fixed` abajo a la derecha.
> Si algún día el tema lo tapa, se sube el `z-index` en ese archivo del repo.

### 4.3. (Opcional) Auto-redimensionado

Actualmente el iframe usa **altura fija (650)** y el bot va anclado abajo, por lo que
tanto cerrado (burbuja) como abierto (panel) se ven bien. La "zona muerta" transparente
de la esquina es asumible. Si se quiere quitar, habría que activar el resize de
Advanced iFrame (external workaround con `ai_external.js`); no está activado a propósito.

---

## 5. Comprobación

1. Abrir la web pública en otra pestaña.
2. Recargar forzando caché: **Ctrl + F5**.
3. Debe aparecer, abajo a la derecha:
   - La **burbuja azul** del bot.
   - El **teaser** de bienvenida a los ~1,4 s ("Hola, soy GallarditoBot…").
4. Al pulsar la burbuja, se abre el chat.

Si GitHub Pages acaba de actualizarse, puede tardar 1–2 min; recargar de nuevo.

---

## 6. Actualizar el contenido del bot (sin tocar WordPress)

1. Editar `gallarditobot.html` (base de conocimiento y lógica).
2. Regenerar el JS: `node build-js.js`
3. `git add -A && git commit -m "..." && git push`
4. Esperar 1–2 min y **Ctrl + F5** en la web.

La base de conocimiento (ciclos, turnos, horarios, trámites, contacto…) está marcada
en `gallarditobot.html` bajo el bloque "BASE DE CONOCIMIENTO".

---

## 7. Datos sensibles (guardar FUERA del repositorio)

Guardar en un gestor de contraseñas o documento privado del centro:

- **FTP** (hosting antiguo, opcional): host `ftpupload.net`, usuario `if0_41719563`,
  contraseña ******, ruta `htdocs/gallarditobot/`. (Ya NO es necesario para la web;
  la web usa GitHub Pages.)
- **Contadores Abacus** — claves de administrador (`token`) para resetear:
  - `visitas2026`  → token ******
  - `consultas2026` → token ******

### Cómo reiniciar un contador a 0

```
curl -X POST "https://abacus.jasoncameron.dev/set/cifptonygallardo/visitas2026?value=0&token=EL_TOKEN"
```

(igual para `consultas2026` con su token). Consultar valor: abrir la URL `/get/...`.

---

## 8. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Sale el código como texto | Se pegó en bloque "HTML personalizado" | Usar bloque **Shortcode** |
| No aparece nada | Advanced iFrame desactivado | Plugins → Activar |
| El iframe sale arriba/mal | No carga `gb-iframe.css` o `?v=` en la URL | URL sin parámetros en "Additional css" |
| Cambios no se ven | Caché | Ctrl+F5; esperar 1–2 min a GitHub Pages |
| El bot no responde algo | Falta en la base de conocimiento | Editar `gallarditobot.html`, regenerar y push |

---

## 9. Estadísticas

- El bot cuenta **visitas** (aperturas únicas por IP y día) y **consultas**
  (cada pregunta del usuario).
- Preguntar al bot "cuántas visitas" o "estadísticas" muestra ambas cifras.
- Es un recuento **orientativo** (no auditable). Para datos fiables usar
  Google Analytics / Matomo.
