import os
from flask import Flask, request, jsonify


# configuration of the Flask session
app = Flask(__name__)

def bad_request():
    return jsonify({'success': False, 'error': 'Bad request'})

@app.route('/list_stocks')
def list_stocks():
    return jsonify({'success': True, 'result': ['nothing', 'right', 'now']})

@app.route('/get_stock', methods=['GET'])
def get_stock():
    stock = request.args.get('stock')
    if not stock:
        return bad_request()
    else:
        return jsonify({'success': True, 'price_vs_time': [1, 2, 3], 'open': 0})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
