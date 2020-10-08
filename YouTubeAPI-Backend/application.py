from flaskApp import create_app


application = create_app(offline=False)


if __name__ == '__main__':
    application.run(debug=False, host='0.0.0.0')
