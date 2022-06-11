from .wrapper import Resource, authenticate
from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from model import user, okved2
from hashlib import md5


class OkvedList(Resource):
    def get(self):
        d = okved2.RSOkved2()
        res = d.getList()
        return make_response(jsonify(res), 200)

