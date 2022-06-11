from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, okved2, region, firm
from hashlib import md5


class FirmList(Resource):
    def get(self):
        d = firm.RSFirm()
        res = d.getList()
        return make_response(jsonify(res), 200)


class FirmFilter(Resource):
    def get(self):
        d = firm.RSFirm()
        p_cat = request.args.get('category')
        p_region = request.args.get('region')
        p_name = request.args.get('name')
        p_inn = request.args.get('inn')

        p_lim = request.args.get('limit')
        p_off = request.args.get('offset')

        res = d.getFiltList(p_cat, p_region, p_name, p_inn, p_lim, p_off)
        return make_response(jsonify(res), 200)