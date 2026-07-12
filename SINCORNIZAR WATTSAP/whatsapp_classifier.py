import sys
import time
import json
import os
import re
from playwright.sync_api import sync_playwright

import unicodedata

def normalize_text(text):
    if not text:
        return ""
    text = unicodedata.normalize('NFD', text)
    return "".join(c for c in text if unicodedata.category(c) != 'Mn').lower()

def auto_classify(text):
    if not text:
        return "Otros"
    
    t = normalize_text(text)
    
    # Función auxiliar para comprobar si existe coincidencia exacta de palabras
    def has_any(words):
        return any(re.search(r'\b' + re.escape(w) + r'\b', t) for w in words)
    
    # 1. Mensajes de Voz y Audios
    if "[mensaje de voz o audio]" in t or re.match(r'^\d{1,2}:\d{2}', t):
        return "Mensajes de Voz y Audios"
        
    # 2. Imágenes y Stickers
    if "[imagen o sticker]" in t or "+4" in t or "+5" in t:
        return "Imágenes y Stickers"
        
    # 3. Redes Sociales y Videos
    if any(domain in t for domain in ["facebook.com", "fb.com", "instagram.com", "tiktok.com", "youtube.com", "youtu.be"]):
        # Priorizar clasificación técnica si el enlace contiene términos académicos específicos
        if not has_any(["arduino", "programacion", "codigo", "desarrollo", "algebra", "trigonometria", "fisica", "estadistica"]):
            return "Redes Sociales y Videos"

    # 4. Música
    if has_any(["musica", "cancion", "letra", "guitarra", "piano", "ritmo", "melodia"]):
        return "Música"
        
    # 5. Álgebra
    if has_any(["algebra", "ecuacion", "variable", "polinomio", "factorizar", "lineal", "matriz"]):
        return "Álgebra"
        
    # 6. Trigonometría
    if has_any(["trigonometria", "seno", "coseno", "tangente", "angulo", "triangulo"]):
        return "Trigonometría"
        
    # 7. Inteligencia Artificial
    if has_any(["ia", "ai", "llm", "chatgpt", "gemini", "prompt", "inteligencia artificial", "artificial intelligence", "agente"]):
        return "Inteligencia Artificial"
        
    # 8. Electrónica
    if has_any(["electronica", "circuito", "resistencia", "led", "sensor", "voltaje", "corriente", "transistor", "arduino", "raspberry", "homelab", "router", "modem", "red", "redes"]):
        return "Electrónica"
        
    # 9. Gestión de Proyectos
    if has_any(["proyecto", "gestion", "scrum", "agile", "cronograma", "planificacion", "gantt"]):
        return "Gestión de Proyectos"
        
    # 10. Física
    if has_any(["fisica", "fuerza", "gravedad", "velocidad", "aceleracion", "energia", "mecanica"]):
        return "Física"
        
    # 11. Estadística
    if has_any(["estadistica", "probabilidad", "media", "mediana", "desviacion", "varianza", "muestreo", "distribucion"]):
        return "Estadística"
        
    # 12. Redacción de Tesis
    if has_any(["tesis", "redaccion", "investigacion", "normas apa", "apa", "marco teorico", "metodologia"]):
        return "Redacción de Tesis"
        
    # 13. Programación
    if has_any(["programacion", "codigo", "software", "desarrollo", "python", "javascript", "html", "css", "git", "web", "aprender"]):
        return "Programación"
        
    return "Otros"

def run_whatsapp_update(headless=True):
    print(f"Iniciando extracción de WhatsApp con Playwright (headless={headless})...")
    
    user_data_dir = os.path.join(os.getcwd(), "whatsapp_session")
    extracted_messages = []
    
    try:
        with sync_playwright() as p:
            # Iniciamos el navegador persistente
            context = p.chromium.launch_persistent_context(
                user_data_dir=user_data_dir,
                headless=headless,
                args=["--start-maximized"] if not headless else []
            )
            
            page = context.new_page()
            page.set_default_timeout(60000)
            
            page.goto("https://web.whatsapp.com/")
            
            # Esperar inicio de sesión
            chat_list_loaded = False
            for i in range(45): # Esperar hasta 90 segundos
                try:
                    if page.locator('div[data-testid="chat-list"]').is_visible(timeout=2000) or \
                       page.locator('div[contenteditable="true"]').first.is_visible(timeout=2000):
                        chat_list_loaded = True
                        break
                except Exception:
                    pass
                time.sleep(2)
                
            if not chat_list_loaded:
                print("Error: No se pudo detectar el inicio de sesión.")
                context.close()
                return None
                
            time.sleep(3)
            
            # Buscar chat Tú / Tu
            chat_element = None
            for name in ["Tu", "Tú"]:
                locator = page.locator(f'span[title="{name}"]').first
                try:
                    if locator.is_visible(timeout=3000):
                        chat_element = locator
                        break
                except Exception:
                    pass
                    
            if not chat_element:
                print("Chat no visible en lista principal, buscando...")
                search_box = None
                search_selectors = [
                    'div[contenteditable="true"]',
                    'div[data-testid="chat-list-search"]',
                    'div[aria-label="Search text"]'
                ]
                for sel in search_selectors:
                    try:
                        loc = page.locator(sel).first
                        if loc.is_visible(timeout=2000):
                            search_box = loc
                            break
                    except Exception:
                        pass
                
                if search_box:
                    search_box.click()
                    time.sleep(1)
                    search_box.fill("Tu")
                    time.sleep(3)
                    
                    for name in ["Tu", "Tú"]:
                        locator = page.locator(f'span[title="{name}"]').first
                        try:
                            if locator.is_visible(timeout=3000):
                                chat_element = locator
                                break
                        except Exception:
                            pass
                
            if not chat_element:
                print("Error: No se pudo encontrar el chat 'Tu' o 'Tú'.")
                context.close()
                return None
                
            # Abrir chat
            chat_element.click()
            time.sleep(3)
            
            # Enfocar y hacer scroll hacia arriba inteligentemente hasta el tope histórico
            try:
                page.locator('div[data-testid="conversation-panel-wrapper"]').click()
            except Exception:
                page.mouse.click(600, 400)
                
            print("Cargando historial completo de mensajes hacia arriba...")
            last_height = 0
            no_change_count = 0
            for scroll_step in range(120):
                # Desplazar al tope superior
                page.evaluate('''() => {
                    const pane = document.querySelector('div[data-testid="conversation-panel-wrapper"]');
                    if (!pane) return;
                    let scrollable = null;
                    const divs = pane.querySelectorAll('div');
                    for (const div of divs) {
                        const style = window.getComputedStyle(div);
                        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                            scrollable = div;
                            break;
                        }
                    }
                    if (scrollable) {
                        scrollable.scrollTop = 0;
                    }
                }''')
                
                time.sleep(1.2) # Esperar a que carguen los mensajes anteriores
                
                # Obtener la altura de scroll actual
                current_height = page.evaluate('''() => {
                    const pane = document.querySelector('div[data-testid="conversation-panel-wrapper"]');
                    if (!pane) return 0;
                    let scrollable = null;
                    const divs = pane.querySelectorAll('div');
                    for (const div of divs) {
                        const style = window.getComputedStyle(div);
                        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
                            scrollable = div;
                            break;
                        }
                    }
                    return scrollable ? scrollable.scrollHeight : 0;
                }''')
                
                if current_height == last_height:
                    no_change_count += 1
                    if no_change_count >= 5:
                        print("Se alcanzó el inicio del historial de mensajes.")
                        break
                else:
                    no_change_count = 0
                    last_height = current_height
                    
            time.sleep(2)
            
            # Extraer mensajes
            message_elements = page.locator('div[data-id]')
            count = message_elements.count()
            
            for i in range(count):
                try:
                    msg_elem = message_elements.nth(i)
                    data_id = msg_elem.get_attribute('data-id')
                    
                    if not data_id or data_id.startswith('album-') and msg_elem.inner_text().strip() == "":
                        continue
                    
                    # Extraer texto de span.selectable-text
                    selectable = msg_elem.locator('span.selectable-text').first
                    text = ""
                    if selectable.is_visible(timeout=200):
                        text = selectable.inner_text()
                    
                    # Extraer metadata de div.copyable-text
                    copyable = msg_elem.locator('div.copyable-text').first
                    timestamp = ""
                    sender = ""
                    
                    if copyable.is_visible(timeout=200):
                        pre_text = copyable.get_attribute('data-pre-plain-text')
                        if pre_text:
                            try:
                                parts = pre_text.strip('[]').split('] ')
                                timestamp = parts[0]
                                sender = parts[1].replace(':', '').strip()
                            except Exception:
                                timestamp = pre_text
                                
                    if not text:
                        raw_text = msg_elem.inner_text()
                        lines = [l.strip() for l in raw_text.split('\n') if l.strip()]
                        if lines:
                            if len(lines) > 1 and (':' in lines[-1] and len(lines[-1]) <= 8):
                                text = "\n".join(lines[:-1])
                            else:
                                text = "\n".join(lines)
                                
                    if not text or text.strip() == "":
                        if msg_elem.locator('img').count() > 0:
                            text = "[Imagen o Sticker]"
                        elif msg_elem.locator('audio').count() > 0 or msg_elem.locator('[data-testid="audio-play"]').count() > 0:
                            text = "[Mensaje de Voz o Audio]"
                        else:
                            text = "[Mensaje no de texto o Multimedia]"
                    
                    if not any(m['data_id'] == data_id for m in extracted_messages):
                        extracted_messages.append({
                            "data_id": data_id,
                            "sender": sender if sender else "Yo (Tú)",
                            "timestamp": timestamp,
                            "text": text.strip()
                        })
                except Exception:
                    pass
                    
            context.close()
            print(f"Extracción completada. {len(extracted_messages)} mensajes obtenidos.")
            return extracted_messages
    except Exception as e:
        print(f"Error durante el scraping: {e}")
        return None

if __name__ == "__main__":
    # Si se corre directamente, actualiza localmente y guarda
    new_msgs = run_whatsapp_update(headless=False)
    if new_msgs:
        output_file = "messages.json"
        # Clasificar y guardar
        for m in new_msgs:
            m["category"] = auto_classify(m["text"])
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(new_msgs, f, ensure_ascii=False, indent=4)
        print("Mensajes guardados con éxito.")
