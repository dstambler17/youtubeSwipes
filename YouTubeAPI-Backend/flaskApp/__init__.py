from flask import Flask
#from flaskApp.conf import OfflineConfiguration, OnlineConfiguration
from flask_cors import CORS, cross_origin

#db = SQLAlchemy()
#bcrypt = Bcrypt()

def create_app(offline=False):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    cors = CORS(app)
    app.config['CORS_HEADERS'] = 'Content-Type'

    #db.init_app(app)
    #bcrypt.init_app(app)

    from flaskApp.youtube.views import youtube
    app.register_blueprint(youtube, url_prefix='/youtube')


    return app