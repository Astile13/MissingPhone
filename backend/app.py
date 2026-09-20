from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3

from database import get_db_connection


app = Flask(__name__)

CORS(app)


def initialize_database():

    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            score INTEGER NOT NULL,
            completion_time INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()

    connection.close()


@app.route("/")
def home():

    return jsonify({
        "message": "Spot the Difference Backend is running!"
    })


if __name__ == "__main__":

    initialize_database()

    app.run(debug=True, port=5000)