# rest-api приложения
from flask import Blueprint
from flask_restful import Api
from . import proba

RestApiBP = Blueprint('restapi', __name__,
                      template_folder='templates')
RestApi = Api(RestApiBP)

#---------------- Actual API 1.0

RestApi.add_resource(proba.ProbaGet, '/proba')

#get post

