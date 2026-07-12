import os
import json
import socket
import datetime
import time
import subprocess
import threading
import re
import hashlib
from flask import Flask, jsonify, render_template, request
from whatsapp_classifier import run_whatsapp_update, auto_classify

app = Flask(__name__)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

# Rutas de almacenamiento
MESSAGES_FILE = "messages.json"

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
        new_msgs = run_whatsapp_update(headless=headless)
        
        if new_msgs is None:
            raise Exception("No se pudo extraer información de WhatsApp Web. Verifica tu sesión.")
            
        # Cargar base de datos existente
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
                
        # Mapear mensajes existentes por su data_id para conservar su categoría
        existing_map = {m["data_id"]: m for m in existing_data.get("messages", [])}
        
        merged_messages = []
        
        # Procesar nuevos mensajes obtenidos
        for nm in new_msgs:
            data_id = nm["data_id"]
            # Si el mensaje ya existía, conservamos su categoría (especialmente las modificadas manualmente)
            if data_id in existing_map:
                nm["category"] = existing_map[data_id].get("category", auto_classify(nm["text"]))
            else:
                # Si es nuevo, lo auto-clasificamos
                nm["category"] = auto_classify(nm["text"])
            merged_messages.append(nm)
            
        # Preservar mensajes antiguos que se hayan salido del viewport o historial actual de Playwright
        new_data_ids = {nm["data_id"] for nm in new_msgs}
        for old_id, old_msg in existing_map.items():
            if old_id not in new_data_ids:
                merged_messages.append(old_msg)
                
        # Registrar metadatos
        now_str = datetime.datetime.now().strftime("%d/%m/%Y, %I:%M %p")
        existing_data["last_update"] = now_str
        existing_data["messages"] = merged_messages
        
        # Guardar en archivo local
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=4)
            
        # Ejecutar respaldo de Git
        git_status = run_git_backup()
        existing_data["git_backup"] = git_status
        
        # Guardar metadatos actualizados con el estado de Git
        with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=4)
            
        return len(merged_messages), git_status

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
                msg["category"] = new_category
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
