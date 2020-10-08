import sys
from flask import Blueprint, request, jsonify
from flaskApp.youtube.utils import *
from flaskApp.error.error_handlers import *
import json

youtube = Blueprint('youtube', __name__)

@youtube.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        request_body = json.loads(request.get_data())
        print(str(request_body))
        youtube = connect_to_youtube_with_auth()
        subscribe_to_channel(youtube, request_body['id'])
        return jsonify({'res' : 'success'}), 201

    except(BadRequest, NotFound) as e:
        return jsonify(e.body), e.status_code

@youtube.route('getChannels/<topic>', methods=['GET'])
def get_channels(topic):
    try:
        youtube = connect_to_youtube_with_auth()
        channels = get_channels_from_topic(youtube, topic, "relevance")
        channels_to_show = [getChannelDetails(youtube, channel) for channel in channels]
        channels_to_show = list({v['id']:v for v in channels_to_show}.values())
        return jsonify(channels_to_show), 200
    except (NotFound) as e:
        return jsonify(e.body), e.status_code


@youtube.route('testApi', methods=['GET'])
def test_api():
    try:
        channels_to_show = [
                            {
                                'id': "1",
                                'title': "Caroline",
                                'age': 24,
                                'image_url':"https://media.wired.com/photos/5926db217034dc5f91becd6b/master/w_1904,c_limit/so-logo-s.jpg",
                            },
                            {
                                'id': "2",
                                'title': "Anet",
                                'age': 30,
                                'image_url': "https://media.wired.com/photos/5926db217034dc5f91becd6b/master/w_1904,c_limit/so-logo-s.jpg",
                            },
                            {
                                'id': "3",
                                'title': "Jack",
                                'age': 21,
                                'image_url': "https://media.wired.com/photos/5926db217034dc5f91becd6b/master/w_1904,c_limit/so-logo-s.jpg",
                            },
                            {
                                'id': "4",
                                'title': "Johna",
                                'age': 28,
                                'image_url': "https://media.wired.com/photos/5926db217034dc5f91becd6b/master/w_1904,c_limit/so-logo-s.jpg",
                            },
                        ]
        return jsonify(channels_to_show), 200
    except (NotFound) as e:
        return jsonify(e.body), e.status_code
