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
            filename = 'stocks/{}.csv'.format(r.Symbol)
            data = pandas.read_csv(filename, parse_dates=['Date'])
            data = data[data['Date'] >= pandas.to_datetime('2016-09-06')]
            stocks[r.Symbol] = {'name': r.Name, 'sector': r.Sector, 'data': data}
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
    symbol = request.args.get('symbol')
    if not symbol or symbol not in stocks:
        return bad_request()

    stock = stocks.get(symbol).get('data')
    chart_data = []
    for i, r in stock.iterrows():
        chart_data.append(dict(r))

    correlations = {}
    for sym, other in stocks.items():
        other = other.get('data')
        if sym != symbol:
            df = pandas.DataFrame(list(zip(stock['Close'], other['Close'])))
            corr = df.corr()[0][1]
            correlations[sym] = corr
    top_corrs = sorted(correlations.items(), key=lambda x: -x[1])[:5]

    return jsonify({
        'success': True,
        'chart': chart_data,
        'correlations': [{
            'symbol': k,
            'name': stocks[k]['name'],
            'corr': v
        } for k, v in top_corrs]
    })

if __name__ == '__main__':
    # pytrends.build_payload(kw_list=['apples', 'bagel'], timeframe='today 1-y')
    init_stocks()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)



"""
import requests
def get(route, *args, **kwargs):
    return requests.get('http://0.0.0.0:5000/' + route, *args, kwargs)
x = get('list_stocks')
print(x.json())
"""
