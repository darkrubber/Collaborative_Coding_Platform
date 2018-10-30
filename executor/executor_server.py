import json
from flask import Flask #similar to express
app = Flask(__name__)

from flask import jsonify 
from flask import request

import executor_utils as eu

# executor server
@app.route('/build_and_run', methods=['POST'])
def build_and_run():
	data = request.get_json()

	if 'code' not in data or 'lang' not in data:
		return 'Please provide "code" and "language"'

	code = data['code']
	lang = data['lang']

	print("executor API got called with code: %s in %s" %(code , lang))

	result = eu.build_and_run(code, lang)

	return jsonify(result)

if __name__ == '__main__':
	eu.load_image()
	app.run()
	