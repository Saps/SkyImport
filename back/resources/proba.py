from sqlalchemy import text
from flask import make_response, jsonify, request, abort, redirect
from flask_restful import Resource as ResFree
from .wrapper import Resource, authenticate
from hashlib import md5


class ProbaGet(ResFree):
    def get(self):
        res = 'Hello World'
        return make_response(jsonify(res), 200)