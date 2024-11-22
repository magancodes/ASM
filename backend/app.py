from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import subprocess

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Route to upload and assemble ASM code
@app.route('/assemble', methods=['POST'])
def assemble():
    if 'asmFile' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    asm_file = request.files['asmFile']
    asm_path = os.path.join(UPLOAD_FOLDER, asm_file.filename)
    asm_file.save(asm_path)

    lst_path = asm_path.replace('.asm', '.lst')
    obj_path = asm_path.replace('.asm', '.o')
    log_path = asm_path.replace('.asm', '.log')

    try:
        # Run assembler
        subprocess.run(['./asm', asm_path], check=True, cwd=os.getcwd())
        response = {
            "listing": open(lst_path).read() if os.path.exists(lst_path) else "No listing generated",
            "log": open(log_path).read() if os.path.exists(log_path) else "No errors",
            "object_file_path": obj_path,
        }
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Assembly failed: {str(e)}"}), 500

    return jsonify(response)

# Route to emulate binary file
@app.route('/emulate', methods=['POST'])
def emulate():
    data = request.json
    obj_path = data.get('object_file_path')
    command = data.get('command')

    if not obj_path or not command:
        return jsonify({"error": "Invalid input"}), 400

    try:
        # Run emulator
        result = subprocess.run(['./emu', command, obj_path], capture_output=True, text=True, cwd=os.getcwd())
        if result.returncode != 0:
            raise Exception(result.stderr)
        return jsonify({"output": result.stdout})
    except Exception as e:
        return jsonify({"error": f"Emulation failed: {str(e)}"}), 500

# Serve binary files if needed (e.g., memory dump)
@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path)
    return jsonify({"error": "File not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
