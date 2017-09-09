import os
import pandas
from pytrends.request import TrendReq
from flask import Flask, request, jsonify


stocks = {}
pytrends = TrendReq()
app = Flask(__name__)


def init_stocks():
    df = pandas.read_csv('s&p500.csv')
    for i, r in df.iterrows():
        try:
            filename = 'stocks/{}.csv'.format(r.Symbol)
            data = pandas.read_csv(filename, parse_dates=['Date'])
            data = data[data['Date'] >= pandas.to_datetime('2017-06-09')]
            if len(data) < 64:
                continue
            stocks[r.Symbol] = {'name': r.Name, 'sector': r.Sector, 'data': data}
        except:
            pass


def correlation(a, b):
    if not len(a) or not len(b):
        return 0
    df = pandas.DataFrame(list(zip(a, b)))
    return float(df.corr()[0][1])


def bad_request():
    return jsonify({'success': False, 'error': 'Bad request'})


@app.route('/trends', methods=['GET'])
def google_trends():
    keywords = request.args.getlist('keywords')
    stock = stocks.get(request.args.get('symbol'))
    if not keywords or not stock:
        return bad_request()

    try:
        pytrends.build_payload(kw_list=keywords, timeframe='today 3-m')
        interest = pytrends.interest_over_time()

        chart_data = []
        for i, r in stock['data'].iterrows():
            chart_data.append(dict(r))

        resp = {'success': True, 'chart': chart_data, 'keywords': {}}

        for key in keywords:
            points = []
            for k, v in sorted(interest[key].items(), key=lambda x: x[0]):
                points.append({'Date': str(k), 'Score': float(v)})

            resp['keywords'][key] = {
                'correlation': correlation(stock['data']['Close'], interest[key]),
                'data': points
            }
    except Exception as e:
        resp = {'success': False, 'error': 'Internal server error'}

    return jsonify(resp)


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
            correlations[sym] = correlation(stock['Close'], other['Close'])

    return jsonify({
        'success': True,
        'chart': chart_data,
        'correlations': [{
            'symbol': k,
            'name': stocks[k]['name'],
            'corr': v
        } for k, v in sorted(correlations.items(), key=lambda x: x[1])]
    })

if __name__ == '__main__':
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
