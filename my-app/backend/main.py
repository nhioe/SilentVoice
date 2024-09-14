from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import subprocess
import requests
import io
import shutil

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for development

UPLOAD_FOLDER = 'uploads'
CONVERTED_FOLDER = 'converted'
ALLOWED_EXTENSIONS = {'mp4', 'webm'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['CONVERTED_FOLDER'] = CONVERTED_FOLDER

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

def clear_folders():
    for folder in [UPLOAD_FOLDER, CONVERTED_FOLDER]:
        if os.path.exists(folder):
            shutil.rmtree(folder)
        os.makedirs(folder)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

balls = [
    {"id": 1, "color": "red"},
    {"id": 2, "color": "blue"}
]

@app.route('/api/balls', methods=['GET'])
def get_balls():
    return jsonify(balls)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'video' not in request.files:
            return jsonify({'message': 'No file part'}), 400

        file = request.files['video']

        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            converted_file_path = None
            
            # Convert video to MP4 if needed
            if filename.endswith('.webm'):
                mp4_filename = filename.rsplit('.', 1)[0] + '.mp4'
                converted_file_path = os.path.join(app.config['CONVERTED_FOLDER'], mp4_filename)
                convert_to_mp4(file_path, converted_file_path)
                
                # Use the converted file path
                file_path = converted_file_path
            
            # Send API request with the appropriate file
            response = send_api_request(file_path)
            print(response)
            if response:
                return jsonify({'message': 'File uploaded and processed successfully!', 'response': response}), 200
            else:
                return jsonify({'message': 'Failed to send API request'}), 500
        else:
            return jsonify({'message': 'File type not allowed'}), 400

    except Exception as e:
        app.logger.error(f"Error uploading file: {e}")
        return jsonify({'message': 'Internal Server Error', 'error': str(e)}), 500

def convert_to_mp4(input_path, output_path):
    try:
        # Basic command for converting to MP4
        command = [
            'ffmpeg', '-i', input_path,
            '-c:v', 'libx264', '-crf', '23',  # Video codec and quality settings
            '-c:a', 'aac', '-b:a', '192k',    # Audio codec and bitrate settings
            '-strict', 'experimental',        # Enable experimental codecs
            output_path
        ]
        
        # Run the command
        subprocess.run(command, check=True)
        print(f"Video converted to {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error converting video: {e}")


def send_api_request(file_path):
    url = "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run"

    with open(file_path, 'rb') as video_file:
        video = io.BytesIO(video_file.read())

    response = requests.post(url, files={'video': ('input.mp4', video, 'video/mp4')})

    return response.text

@app.route('/api/receive-result', methods=['POST'])
def receive_result():
    data = request.get_json()
    result = data.get('result')
    
    if not result:
        return jsonify({'message': 'No result provided'}), 400

    # Process the result as needed
    print(f'Result received: {result}')
    
    return jsonify({'message': 'Result received successfully!'}), 200


if __name__ == '__main__':
    clear_folders()
    app.run(port=8000, debug=True)
