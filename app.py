# Importing necessary libraries and modules
import yfinance as yf  # Used for fetching stock data
from flask import request, render_template, jsonify, Flask  # Flask modules for web development

# Creating a Flask application
app = Flask(__name__, template_folder='templates')

# Route for the root URL ('/')
@app.route('/')
def index():
    # Render the 'index.html' template when the root URL is accessed
    return render_template('index.html')

# Route for fetching stock data ('/get_stock_data') with POST method
@app.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    # Get the ticker symbol from the request data
    ticker = request.get_json()['ticker']
    
    # Fetch historical stock data for the specified ticker symbol for the past year
    data = yf.Ticker(ticker).history(period='1y')
    
    # Return JSON response with current and open price of the stock
    return jsonify({'currentPrice': data.iloc[-1].Close, 'openPrice': data.iloc[-1].Open })

# Run the Flask application if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)  # Run the app in debug mode for development purposes
