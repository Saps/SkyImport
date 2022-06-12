# rest-api приложения
from flask import Blueprint
from flask_restful import Api
from . import proba, user, okved2, region, firm

RestApiBP = Blueprint('restapi', __name__,
                      template_folder='templates')
RestApi = Api(RestApiBP)

#---------------- Actual API 1.0

RestApi.add_resource(proba.ProbaGet, '/proba')

RestApi.add_resource(user.UserLogin, '/user/login')
RestApi.add_resource(user.UserLogout, '/user/logout')
RestApi.add_resource(user.UserCurrent, '/user/current')
#get post
RestApi.add_resource(okved2.OkvedList, '/okved2')

RestApi.add_resource(region.RegionList, '/region')

RestApi.add_resource(firm.FirmList, '/firm')
RestApi.add_resource(firm.FirmFilter, '/firmfil')
