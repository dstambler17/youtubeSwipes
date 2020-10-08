import sys
from flaskApp.error.error_handlers import *
from apiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from enum import Enum
import pickle
import os.path
import time


SortOrder = Enum('SortOrder', 'date rating relevance title videoCount viewCount')

def connect_to_youtube():
    API_KEY =  os.environ['YOUTUBE_API_KEY']

    youtube = build('youtube', 'v3', developerKey=API_KEY)
    #print(type(youtube))
    return youtube

def connect_to_youtube_with_auth():
    #Stores the credentials
    credentials = None
    if os.path.isfile("token.pkl"):
        credentials = pickle.load(open("token.pkl", "rb"))
    if credentials is None:
        CLIENT_SECRET = 'client_secret.json'
        SCOPES = ['https://www.googleapis.com/auth/youtube']
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
        credentials = flow.run_console()
        pickle.dump(credentials, open("token.pkl", "wb"))
    youtube = build('youtube', 'v3', credentials=credentials)
    #print(type(youtube))
    return youtube


def subscribe_to_channel(youtube, channel):
    request = youtube.subscriptions().insert(
        part="snippet",
        body={
          "snippet": {
            "resourceId": {
              "kind": "youtube#channel",
              "channelId": channel
            }
          }
        }
    )
    response = request.execute()


def get_channels_from_topic(youtube, topic, order=None):
    search_items = youtube.search().list(q=topic, part='snippet', maxResults=25, order=order, relevanceLanguage='EN').execute()['items']
    channels = [item['snippet']['channelId'] for item in search_items]
    return channels


def getChannelDetails(youtube, channelId):
    channelDetails = youtube.channels().list(id=channelId, part='snippet').execute()
    snippet_info = channelDetails['items'][0]['snippet']
    title, description, publishedAt = snippet_info['title'], snippet_info['description'], snippet_info['publishedAt']
    image_url = snippet_info['thumbnails']['medium']['url']
    res_dict = {'id': channelId, 'title' : title, 'description' : description, 'publishedAt' : publishedAt, 'image_url': image_url}
    #print(res_dict)
    return res_dict