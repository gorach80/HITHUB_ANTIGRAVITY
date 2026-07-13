import os
import json
import socket
import datetime
import time
import subprocess
import threading
import re
import hashlib
import urllib.request
import urllib.parse
from html.parser import HTMLParser
from flask import Flask, jsonify, render_template, request
from whatsapp_classifier import run_whatsapp_update, auto_classify

# ---- Open Graph parser ----
class OGParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.og = {}
    def handle_starttag(self, tag, attrs):
        if tag == 'meta':
            d = dict(attrs)
            prop = d.get('property', d.get('name', ''))
            content = d.get('content', '')
            if prop in ('og:image', 'og:title', 'og:description', 'og:site_name'):
                self.og[prop] = content
            elif prop == 'twitter:image' and 'og:image' not in self.og:
                self.og['og:image'] = content
            elif prop == 'twitter:title' and 'og:title' not in self.og:
                self.og['og:title'] = content

app = Flask(__name__)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

# Rutas de almacenamiento
MESSAGES_FILE = "messages.json"
CATEGORIES_FILE = "categories.json"

# Lock para evitar colisiones de Playwright
playwright_lock = threading.Lock()

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def run_git_backup():
    print("Iniciando respaldo en GitHub...")
    if not os.path.exists(MESSAGES_FILE):
        return "Sin archivo"
        
    try:
        # Añadir al index
        subprocess.run(["git", "add", MESSAGES_FILE], check=True)
        
        # Realizar commit si hay cambios
        commit_res = subprocess.run(
            ["git", "commit", "-m", "Auto-update WhatsApp messages classification"], 
            capture_output=True, 
            text=True
        )
        
        # Verificar si no había cambios
        if "nothing to commit" in commit_res.stdout or "no changes added to commit" in commit_res.stdout:
            print("Git: No hay cambios para respaldar.")
            return "Completado"
            
        # Hacer push
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("Respaldo en GitHub completado con éxito.")
        return "Completado"
    except Exception as e:
        print(f"Error al respaldar en GitHub: {e}")
        return "Fallido"

def update_and_merge_messages(headless=True):
    with playwright_lock:
        print(f"Iniciando ciclo de actualización (headless={headless})...")
        
        def get_existing_data():
            existing_data = {"last_update": "Nunca", "git_backup": "Sin Verificar", "messages": []}
            if os.path.exists(MESSAGES_FILE):
                try:
                    with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
                        loaded = json.load(f)
                        if isinstance(loaded, list):
                            existing_data["messages"] = loaded
                        elif isinstance(loaded, dict):
                            existing_data = loaded
                except Exception:
                    pass
            return existing_data

        last_git_status = ["Sin Verificar"]

        def save_and_backup_callback(current_extracted):
            existing_data = get_existing_data()
            existing_map = {m["data_id"]: m for m in existing_data.get("messages", [])}
            
            merged_messages = []
            for nm in current_extracted:
                data_id = nm["data_id"]
                if data_id in existing_map:
                    nm["category"] = existing_map[data_id].get("category", auto_classify(nm["text"]))
                else:
                    nm["category"] = auto_classify(nm["text"])
                merged_messages.append(nm)
                
            new_data_ids = {nm["data_id"] for nm in current_extracted}
            for old_id, old_msg in existing_map.items():
                if old_id not in new_data_ids:
                    merged_messages.append(old_msg)
                    
            now_str = datetime.datetime.now().strftime("%d/%m/%Y, %I:%M %p")
            existing_data["last_update"] = now_str
            existing_data["messages"] = merged_messages
            
            with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=4)
                
            git_status = run_git_backup()
            last_git_status[0] = git_status
            existing_data["git_backup"] = git_status
            
            with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=4)
                
            print(f"Sincronizacion en tiempo real ejecutada: {len(merged_messages)} mensajes en messages.json. Git: {git_status}")

        new_msgs = run_whatsapp_update(headless=headless, on_update_callback=save_and_backup_callback)
        
        if new_msgs is None:
            raise Exception("No se pudo extraer información de WhatsApp Web. Verifica tu sesión.")
            
        save_and_backup_callback(new_msgs)
        return len(new_msgs), last_git_status[0]

# Hilo planificador en segundo plano
def scheduler_worker():
    print("Planificador en segundo plano iniciado.")
    last_run_day = None
    
    while True:
        now = datetime.datetime.now()
        # Horas objetivo para las actualizaciones: 8:00 AM, 2:00 PM, 8:00 PM
        target_hours = [8, 14, 20]
        
        if now.hour in target_hours and now.day != last_run_day:
            print(f"Planificador automático activado a las {now.hour}:00...")
            try:
                # En ejecuciones automáticas usamos modo oculto (headless=True)
                count, git_status = update_and_merge_messages(headless=True)
                print(f"Actualización automática completada: {count} mensajes. Git: {git_status}")
                last_run_day = now.day
            except Exception as e:
                print(f"Error en la actualización automática del planificador: {e}")
                
        # Dormir por un minuto antes de volver a chequear
        time.sleep(60)

# Endpoints Flask
@app.route('/')
def home():
    # Flask requiere buscar index.html en /templates
    return render_template("index.html")

def load_messages_data():
    data = {"last_update": "Nunca", "git_backup": "Sin Verificar", "messages": [], "ip_address": get_local_ip()}
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
                loaded = json.load(f)
                if isinstance(loaded, list):
                    data["messages"] = loaded
                elif isinstance(loaded, dict):
                    data.update(loaded)
        except Exception:
            pass
    data["ip_address"] = get_local_ip()
    return data

@app.route('/api/messages')
def get_messages():
    data = load_messages_data()
    return jsonify(data)

@app.route('/api/messages/update_category', methods=['POST'])
def update_category():
    req_data = request.get_json()
    data_id = req_data.get('data_id')
    new_category = req_data.get('category')
    
    if not data_id or not new_category:
        return jsonify({"success": False, "error": "Faltan parámetros"}), 400
        
    if not os.path.exists(MESSAGES_FILE):
        return jsonify({"success": False, "error": "No hay mensajes guardados aún"}), 404
        
    try:
        data = load_messages_data()
            
        found = False
        for msg in data.get("messages", []):
            if msg["data_id"] == data_id:
                if new_category == "recientes":
                    msg["category"] = "Otros"
                    msg["classified"] = False
                else:
                    msg["category"] = new_category
                    msg["classified"] = True   # marcado como clasificado manualmente
                found = True
                break
                
        if not found:
            return jsonify({"success": False, "error": "Mensaje no encontrado"}), 404
            
        # Guardar en local
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        # Respaldar cambios en GitHub
        git_status = run_git_backup()
        data["git_backup"] = git_status
        
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        return jsonify({"success": True, "git_backup": git_status})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

header_re = re.compile(
    r'^\[?(\d{1,2}[/\.-]\d{1,2}[/\.-]\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[aApP]\.?\s*[mM]\.?)?)\]?(?:\s*-\s*|\s+)([^:]+):\s*(.*)$'
)

def generate_message_hash(timestamp, sender, text):
    raw = f"{timestamp}|{sender}|{text}"
    return hashlib.md5(raw.encode('utf-8')).hexdigest().upper()

def parse_whatsapp_txt(file_content):
    messages = []
    current_msg = None
    lines = file_content.splitlines()
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        m = header_re.match(line)
        if m:
            if current_msg:
                messages.append(current_msg)
            
            date_str = m.group(1)
            time_str = m.group(2)
            sender = m.group(3).strip()
            text = m.group(4).strip()
            
            timestamp = f"{time_str}, {date_str}"
            current_msg = {
                "sender": sender,
                "timestamp": timestamp,
                "text": text
            }
        else:
            if current_msg:
                current_msg["text"] += "\n" + line
                
    if current_msg:
        messages.append(current_msg)
        
    return messages

@app.route('/api/messages/import', methods=['POST'])
def import_messages():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No se subió ningún archivo"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "Archivo vacío"}), 400
        
    try:
        content = file.read().decode('utf-8', errors='ignore')
        imported_msgs = parse_whatsapp_txt(content)
        
        if not imported_msgs:
            return jsonify({"success": False, "error": "No se encontraron mensajes válidos en el archivo"}), 400
            
        data = load_messages_data()
        existing_messages = data.get("messages", [])
        existing_map = {m["data_id"]: m for m in existing_messages}
        
        new_added_count = 0
        
        for im in imported_msgs:
            data_id = generate_message_hash(im["timestamp"], im["sender"], im["text"])
            
            sender = im["sender"]
            if sender.lower() in ["yo", "tú", "tu"]:
                sender = "Yo (Tú)"
            
            if data_id not in existing_map:
                category = auto_classify(im["text"])
                new_msg = {
                    "data_id": data_id,
                    "sender": sender,
                    "timestamp": im["timestamp"],
                    "text": im["text"],
                    "category": category
                }
                existing_messages.append(new_msg)
                existing_map[data_id] = new_msg
                new_added_count += 1
                
        if new_added_count > 0:
            now_str = datetime.datetime.now().strftime("%d/%m/%Y, %I:%M %p")
            data["last_update"] = now_str
            data["messages"] = existing_messages
            
            with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
                
            git_status = run_git_backup()
            data["git_backup"] = git_status
            
            with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
        else:
            git_status = data.get("git_backup", "Completado")
            
        return jsonify({
            "success": True, 
            "count": new_added_count, 
            "total": len(existing_messages),
            "git_backup": git_status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/update', methods=['POST'])
def manual_update():
    try:
        count, git_status = update_and_merge_messages(headless=False)
        return jsonify({"success": True, "count": count, "git_backup": git_status})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def load_categories():
    if os.path.exists(CATEGORIES_FILE):
        try:
            with open(CATEGORIES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    # Defaults fallback
    defaults = ["Música", "Álgebra", "Trigonometría", "Inteligencia Artificial", "Electrónica", "Gestión de Proyectos", "Física", "Estadística", "Redacción de Tesis", "Programación", "Redes Sociales y Videos", "Mensajes de Voz y Audios", "Imágenes y Stickers", "Otros"]
    with open(CATEGORIES_FILE, "w", encoding="utf-8") as f:
        json.dump(defaults, f, ensure_ascii=False, indent=4)
    return defaults

@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify(load_categories())

@app.route('/api/categories/add', methods=['POST'])
def add_category():
    try:
        req = request.get_json()
        name = req.get('name', '').strip()
        if not name:
            return jsonify({"success": False, "error": "Nombre vacío"}), 400
        
        categories = load_categories()
        if name in categories:
            return jsonify({"success": False, "error": "La categoría ya existe"}), 400
            
        # Ordenar alfabéticamente, Otros siempre al final
        if "Otros" in categories:
            categories.remove("Otros")
        categories.append(name)
        categories = sorted([c for c in categories if c != "Otros"], key=lambda x: x.lower())
        categories.append("Otros")
        
        with open(CATEGORIES_FILE, "w", encoding="utf-8") as f:
            json.dump(categories, f, ensure_ascii=False, indent=4)
            
        # Git backup de las categorías
        try:
            subprocess.run(["git", "add", CATEGORIES_FILE], check=True)
            subprocess.run(["git", "commit", "-m", f"Add custom category: {name}"], capture_output=True)
            subprocess.run(["git", "push", "origin", "main"], capture_output=True)
        except Exception:
            pass
            
        return jsonify({"success": True, "categories": categories})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/categories/rename', methods=['POST'])
def rename_category():
    try:
        req = request.get_json()
        old_name = req.get('old_name', '').strip()
        new_name = req.get('new_name', '').strip()
        if not old_name or not new_name:
            return jsonify({"success": False, "error": "Parámetros inválidos"}), 400
        if old_name == "Otros" or new_name == "Otros":
            return jsonify({"success": False, "error": "No se puede renombrar la categoría Otros"}), 400
            
        categories = load_categories()
        if old_name not in categories:
            return jsonify({"success": False, "error": "La categoría origen no existe"}), 404
        if new_name in categories:
            return jsonify({"success": False, "error": "La categoría destino ya existe"}), 400
            
        categories.remove(old_name)
        categories.append(new_name)
        if "Otros" in categories:
            categories.remove("Otros")
        categories = sorted([c for c in categories if c != "Otros"], key=lambda x: x.lower())
        categories.append("Otros")
        
        with open(CATEGORIES_FILE, "w", encoding="utf-8") as f:
            json.dump(categories, f, ensure_ascii=False, indent=4)
            
        # Renombrar en mensajes
        data = load_messages_data()
        messages = data.get("messages", [])
        updated = 0
        for msg in messages:
            if msg.get("category") == old_name:
                msg["category"] = new_name
                updated += 1
        if updated > 0:
            data["messages"] = messages
            with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
                
        run_git_backup()
        return jsonify({"success": True, "categories": categories, "updated_count": updated})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/categories/delete', methods=['POST'])
def delete_category():
    try:
        req = request.get_json()
        name = req.get('name', '').strip()
        if not name:
            return jsonify({"success": False, "error": "Parámetro inválido"}), 400
        if name == "Otros":
            return jsonify({"success": False, "error": "No se puede eliminar la categoría Otros"}), 400
            
        categories = load_categories()
        if name not in categories:
            return jsonify({"success": False, "error": "La categoría no existe"}), 404
            
        categories.remove(name)
        with open(CATEGORIES_FILE, "w", encoding="utf-8") as f:
            json.dump(categories, f, ensure_ascii=False, indent=4)
            
        # Mover mensajes a Otros
        data = load_messages_data()
        messages = data.get("messages", [])
        updated = 0
        for msg in messages:
            if msg.get("category") == name:
                msg["category"] = "Otros"
                updated += 1
        if updated > 0:
            data["messages"] = messages
            with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
                
        run_git_backup()
        return jsonify({"success": True, "categories": categories, "updated_count": updated})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

RULES_FILE = "rules.json"

def load_rules():
    if os.path.exists(RULES_FILE):
        try:
            with open(RULES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return []

@app.route('/api/rules', methods=['GET'])
def get_rules():
    return jsonify(load_rules())

@app.route('/api/rules/add', methods=['POST'])
def add_rule():
    try:
        req = request.get_json()
        keyword = req.get('keyword', '').strip()
        category = req.get('category', '').strip()
        if not keyword or not category:
            return jsonify({"success": False, "error": "Palabra clave y categoría requeridas"}), 400
            
        rules = load_rules()
        for rule in rules:
            if rule.get("keyword").lower() == keyword.lower():
                return jsonify({"success": False, "error": "Ya existe una regla para esa palabra clave"}), 400
                
        rules.append({"keyword": keyword, "category": category})
        with open(RULES_FILE, "w", encoding="utf-8") as f:
            json.dump(rules, f, ensure_ascii=False, indent=4)
            
        try:
            subprocess.run(["git", "add", RULES_FILE], check=True)
            subprocess.run(["git", "commit", "-m", f"Add custom rule: {keyword} -> {category}"], capture_output=True)
            subprocess.run(["git", "push", "origin", "main"], capture_output=True)
        except Exception:
            pass
            
        return jsonify({"success": True, "rules": rules})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/rules/delete', methods=['POST'])
def delete_rule():
    try:
        req = request.get_json()
        keyword = req.get('keyword', '').strip()
        if not keyword:
            return jsonify({"success": False, "error": "Palabra clave requerida"}), 400
            
        rules = load_rules()
        original_count = len(rules)
        rules = [r for r in rules if r.get("keyword").lower() != keyword.lower()]
        
        if len(rules) == original_count:
            return jsonify({"success": False, "error": "Regla no encontrada"}), 404
            
        with open(RULES_FILE, "w", encoding="utf-8") as f:
            json.dump(rules, f, ensure_ascii=False, indent=4)
            
        try:
            subprocess.run(["git", "add", RULES_FILE], check=True)
            subprocess.run(["git", "commit", "-m", f"Delete custom rule: {keyword}"], capture_output=True)
            subprocess.run(["git", "push", "origin", "main"], capture_output=True)
        except Exception:
            pass
            
        return jsonify({"success": True, "rules": rules})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/messages/add_external', methods=['POST'])
def add_external_message():
    try:
        req = request.get_json()
        text = req.get('text', '').strip()
        sender = req.get('sender', 'Yo (Tú)').strip()
        category = req.get('category', 'Otros').strip()
        timestamp = req.get('timestamp', '').strip()
        
        if not text:
            return jsonify({"success": False, "error": "El mensaje no tiene texto"}), 400
            
        data_id = generate_message_hash(timestamp, sender, text)
        
        data = load_messages_data()
        messages = data.get("messages", [])
        existing_map = {m["data_id"]: m for m in messages}
        
        if data_id in existing_map:
            existing_map[data_id]["category"] = category
        else:
            new_msg = {
                "data_id": data_id,
                "sender": sender,
                "timestamp": timestamp,
                "text": text,
                "category": category
            }
            messages.append(new_msg)
            
        data["messages"] = messages
        now_str = datetime.datetime.now().strftime("%d/%m/%Y, %I:%M %p")
        data["last_update"] = now_str
        
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        git_status = run_git_backup()
        data["git_backup"] = git_status
        
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        return jsonify({"success": True, "git_backup": git_status})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/og-preview', methods=['GET'])
def og_preview():
    """Extrae metadatos Open Graph de una URL para mostrar miniatura en la web."""
    url = request.args.get('url', '').strip()
    if not url or not url.startswith('http'):
        return jsonify({"success": False, "error": "URL inválida"}), 400
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (compatible; WhatsAppClassifier/1.0)',
                'Accept': 'text/html'
            }
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            html_bytes = resp.read(8192)  # solo primeros 8KB para rapidez
            html_text = html_bytes.decode('utf-8', errors='ignore')
        
        parser = OGParser()
        parser.feed(html_text)
        og = parser.og
        
        return jsonify({
            "success": True,
            "image": og.get('og:image', ''),
            "title": og.get('og:title', ''),
            "description": og.get('og:description', ''),
            "site": og.get('og:site_name', '')
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 200

@app.route('/api/messages/delete', methods=['POST'])
def delete_message():
    try:
        req = request.get_json()
        data_id = req.get('data_id', '').strip()
        if not data_id:
            return jsonify({"success": False, "error": "data_id requerido"}), 400

        data = load_messages_data()
        messages = data.get("messages", [])
        original_count = len(messages)
        messages = [m for m in messages if m.get("data_id") != data_id]

        if len(messages) == original_count:
            return jsonify({"success": False, "error": "Mensaje no encontrado"}), 404

        data["messages"] = messages
        data["last_update"] = datetime.datetime.now().strftime("%d/%m/%Y, %I:%M %p")

        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        git_status = run_git_backup()
        return jsonify({"success": True, "git_backup": git_status, "remaining": len(messages)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/messages/delete-bulk', methods=['POST'])
def delete_bulk():
    """Elimina todos los mensajes de una categoría o todos si category='all'."""
    try:
        req = request.get_json()
        category = req.get('category', '').strip()
        if not category:
            return jsonify({"success": False, "error": "Categoría requerida"}), 400

        data = load_messages_data()
        messages = data.get("messages", [])
        original_count = len(messages)

        if category == 'all':
            messages = []
        elif category == '__unclassified__':
            messages = [m for m in messages if m.get('classified', False)]
        else:
            messages = [m for m in messages if m.get("category") != category]

        deleted = original_count - len(messages)
        data["messages"] = messages
        data["last_update"] = datetime.datetime.now().strftime("%d/%m/%Y, %I:%M %p")

        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        git_status = run_git_backup()
        return jsonify({
            "success": True,
            "deleted": deleted,
            "remaining": len(messages),
            "git_backup": git_status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # Iniciar el hilo del planificador automático
    scheduler_thread = threading.Thread(target=scheduler_worker, daemon=True)
    scheduler_thread.start()
    
    # Servir la aplicación vinculándola a 0.0.0.0 para que se acceda desde la red Wi-Fi
    local_ip = get_local_ip()
    print(f"\n==================================================")
    print(f" SERVIDOR INICIADO")
    print(f" Acceso en PC: http://localhost:5000")
    print(f" Acceso en Celular: http://{local_ip}:5000")
    print(f"==================================================\n")
    app.run(host='0.0.0.0', port=5000, debug=False)
