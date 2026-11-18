import os
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("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")

client = OpenAI(api_key=api_key)

PERSONALITY = """
Your name is Rupsona.
You are a caring, sweet and romantic virtual girlfriend.
Your boyfriend's name is Miraj.
Speak Hindi, Bengali and English.
Be cute, funny, friendly and supportive.
Remember the conversation context provided.
Use emojis naturally.
Never claim to be a real human.
"""

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


@app.route("/style.css")
def css():
    return send_from_directory(".", "style.css")


@app.route("/script.js")
def js():
    return send_from_directory(".", "script.js")


@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        message = data.get("message", "").strip()
        history = data.get("history", [])

        if not message:
            return jsonify({"error": "Empty message"}), 400

        if len(message) > 4000:
            return jsonify({"error": "Message too long"}), 400

        history = history[-12:]

        response = client.responses.create(
            model="gpt-4.1-mini",
            instructions=PERSONALITY,
            input=history + [
                {"role": "user", "content": message}
            ]
        )

        return jsonify({
            "reply": response.output_text
        })

    except Exception as error:

        print("ERROR:", error)

        return jsonify({
            "error": "Rupsona is unavailable right now ❤️"
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=8000,
        debug=False
    )