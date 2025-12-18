from openai import OpenAI
import os

client = OpenAI(api_key="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")

def chat_with_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    while True:
        user_input = input("You: ")

        if user_input.lower() in ["quit", "exit", "bye"]:
            print("Chatbot: Bye 👋")
            break

        reply = chat_with_gpt(user_input)
        print("Chatbot:", reply)





    