from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Default settings
DEFAULT_SETTINGS = {
    "webhookUrl": "https://api.example.com/webhook",
    "openaiApiKey": "",
    "products": ["מוצר 1", "מוצר 2", "מוצר 3"],
    "primaryColor": "#2563eb",
    "secondaryColor": "#6b7280",
    "textColor": "#1f2937",
    "backgroundColor": "#ffffff",
    "fontFamily": "system-ui, -apple-system, sans-serif",
    "fontSize": "14px",
    "welcomeMessage": "שלום! איך אני יכול לעזור לך היום?",
    "chatTitle": "צ'אטבוט",
    "chatIcon": "💬",
    "botName": "עוזר",
    "userPlaceholder": "הקלד הודעה..."
}

# In-memory storage (in production, use a database)
settings = DEFAULT_SETTINGS.copy()
conversations = {}

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get current settings"""
    return jsonify(settings)

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Update settings"""
    global settings
    try:
        new_settings = request.json
        if not new_settings:
            return jsonify({"error": "No settings provided"}), 400
        
        # Update settings
        settings.update(new_settings)
        
        return jsonify({"message": "Settings updated successfully", "settings": settings})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/settings/reset', methods=['POST'])
def reset_settings():
    """Reset settings to default"""
    global settings
    settings = DEFAULT_SETTINGS.copy()
    return jsonify({"message": "Settings reset successfully", "settings": settings})

@app.route('/api/chat/send', methods=['POST'])
def send_to_openai():
    """Send message to OpenAI and return response"""
    try:
        data = request.json
        message = data.get('message')
        conversation_id = data.get('conversationId')
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        if not settings.get('openaiApiKey'):
            return jsonify({"error": "OpenAI API key not configured"}), 400
        
        # Initialize conversation if not exists
        if conversation_id not in conversations:
            conversations[conversation_id] = {
                "messages": [],
                "created_at": datetime.now().isoformat()
            }
        
        # Add user message to conversation
        conversations[conversation_id]["messages"].append({
            "role": "user",
            "content": message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Prepare OpenAI request
        openai_messages = [
            {"role": "system", "content": f"אתה עוזר וירטואלי בשם {settings.get('botName', 'עוזר')}. ענה בעברית בצורה ידידותית ומועילה."}
        ]
        
        # Add conversation history
        for msg in conversations[conversation_id]["messages"]:
            openai_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Call OpenAI API
        client = openai.OpenAI(api_key=settings['openaiApiKey'])
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=openai_messages,
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Add AI response to conversation
        conversations[conversation_id]["messages"].append({
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.now().isoformat()
        })
        
        return jsonify({
            "response": ai_response,
            "conversationId": conversation_id
        })
        
    except openai.AuthenticationError:
        return jsonify({"error": "מפתח OpenAI לא תקין"}), 401
    except openai.RateLimitError:
        return jsonify({"error": "חרגת ממגבלת הקריאות ל-OpenAI"}), 429
    except Exception as e:
        return jsonify({"error": f"שגיאה בשליחה ל-OpenAI: {str(e)}"}), 500

@app.route('/api/lead/submit', methods=['POST'])
def submit_lead():
    """Submit lead data to webhook"""
    try:
        lead_data = request.json
        conversation_id = lead_data.get('conversationId')
        
        if not lead_data:
            return jsonify({"error": "Lead data is required"}), 400
        
        # Add conversation history to lead data
        if conversation_id and conversation_id in conversations:
            lead_data['conversation'] = conversations[conversation_id]
        
        # Add timestamp
        lead_data['submitted_at'] = datetime.now().isoformat()
        
        # Send to webhook if configured
        webhook_url = settings.get('webhookUrl')
        if webhook_url and webhook_url != "https://api.example.com/webhook":
            try:
                webhook_response = requests.post(
                    webhook_url,
                    json=lead_data,
                    headers={'Content-Type': 'application/json'},
                    timeout=30
                )
                
                if webhook_response.status_code == 200:
                    # Clean up conversation after successful submission
                    if conversation_id in conversations:
                        del conversations[conversation_id]
                    
                    return jsonify({
                        "message": "Lead submitted successfully",
                        "webhook_status": "success"
                    })
                else:
                    return jsonify({
                        "message": "Lead received but webhook failed",
                        "webhook_status": "failed",
                        "webhook_error": f"Status code: {webhook_response.status_code}"
                    }), 200
                    
            except requests.RequestException as e:
                return jsonify({
                    "message": "Lead received but webhook failed",
                    "webhook_status": "failed",
                    "webhook_error": str(e)
                }), 200
        else:
            return jsonify({
                "message": "Lead received (no webhook configured)",
                "webhook_status": "no_webhook"
            })
            
    except Exception as e:
        return jsonify({"error": f"שגיאה בשליחת הליד: {str(e)}"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "settings_configured": bool(settings.get('openaiApiKey'))
    })

@app.route('/api/conversations', methods=['GET'])
def get_conversations():
    """Get all active conversations (for debugging)"""
    return jsonify({
        "active_conversations": len(conversations),
        "conversations": list(conversations.keys())
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"Starting server on port {port}")
    print(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)