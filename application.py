import os
import pandas
from flask import Flask, request, jsonify


QUANDL_URL = 'https://www.quandl.com/api/v3/datasets/WIKI/{}.csv'
stocks = {}

def init_stocks():
    df = pandas.read_csv('s&p500.csv')
    for i, r in df.iterrows():
        try:
            stocks[r.Symbol] = {'name': r.Name, 'sector': r.Sector}
            filename = 'stocks/{}.csv'.format(r.Symbol)
            stock = pandas.read_csv(filename, parse_dates=['Date'])
            stock = stock[stock['Date'] > pandas.to_datetime('2010-01-01')]
            stocks[r.Symbol] = stock.set_index('Date')
        except:
            pass

app = Flask(__name__)

def bad_request():
    return jsonify({'success': False, 'error': 'Bad request'})

@app.route('/list_stocks')
def list_stocks():
    result = []
    for k, v in stocks.items():
        result.append({'symbol': k, 'name': v['name'], 'change': v['change']})
    return jsonify({'success': True, 'result': result})

@app.route('/get_stock', methods=['GET'])
def get_stock():
    stock = request.args.get('stock')
    if not stock:
        return bad_request()
    else:
        return jsonify({'success': True, 'price_vs_time': [1, 2, 3], 'open': 0})

if __name__ == '__main__':
    init_stocks()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
