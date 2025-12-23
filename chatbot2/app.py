from flask import Flask, render_template, request, jsonify
from chatbot_core import chatbot_reply

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json["message"]
    print("USER:", user_msg)   
    bot_msg = chatbot_reply(user_msg.lower())
    print("BOT:", bot_msg)    
    return jsonify({"reply": bot_msg})


if __name__ == "__main__":
    app.run(debug=True)
