from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, okved2, region, firm, prodgroup
from hashlib import md5


class ProdGroupList(Resource):
    def get(self):
        d = prodgroup.RSProdGroup()
        res = d.getList()
        return make_response(jsonify(res), 200)


class ProdGroupList2(Resource):
    def get(self):
        d = prodgroup.RSProdGroup()
        res = d.getList2()
        return make_response(jsonify(res), 200)


class ProdGroupReset(Resource):
    def get(self):
        fid = request.args.get('id')
        d = prodgroup.RSProdGroup()
        res = d.resetPG(fid)
        return make_response(jsonify(res), 200)