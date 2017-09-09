import os
import pandas
# from pytrends.request import TrendReq
from flask import Flask, request, jsonify


# pytrends = TrendReq()
stocks = {}

def init_stocks():
    df = pandas.read_csv('s&p500.csv')
    for i, r in df.iterrows():
        try:
            stocks[r.Symbol] = {'name': r.Name, 'sector': r.Sector}
            filename = 'stocks/{}.csv'.format(r.Symbol)
            stock = pandas.read_csv(filename, parse_dates=['Date'])
            stock = stock[stock['Date'] > pandas.to_datetime('2016-09-06')]
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
        result.append({'symbol': k, 'name': v['name']})
    return jsonify({'success': True, 'result': result})

@app.route('/get_stock', methods=['GET'])
def get_stock():
    stock = request.args.get('stock')
    if not stock or stock not in stocks:
        return bad_request()
    else:
        resp = []
        for i, r in stocks[stock].iterrows():
            resp.append(dict(r))
        return jsonify({'success': True, 'result': resp})

if __name__ == '__main__':
    # pytrends.build_payload(kw_list=['apples', 'bagel'], timeframe='today 1-y')
    init_stocks()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
