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
        p_prodname = request.args.get('prodname')

        p_lim = request.args.get('limit')
        p_off = request.args.get('offset')

        cn, res = d.getFiltList(p_cat, p_region, p_name, p_inn, p_prodname, p_lim, p_off, p_app = 1)
        res2 = {
            'count' : cn,
            'items' : res
        }
        return make_response(jsonify(res2), 200)


class FirmModFilter(Resource):
    def get(self):
        d = firm.RSFirm()
        p_cat = request.args.get('category')
        p_region = request.args.get('region')
        p_name = request.args.get('name')
        p_inn = request.args.get('inn')
        p_prodname = request.args.get('prodname')

        p_lim = request.args.get('limit')
        p_off = request.args.get('offset')

        cn, res = d.getFiltList(p_cat, p_region, p_name, p_inn, p_prodname, p_lim, p_off, p_app = 0)
        res2 = {
            'count' : cn,
            'items' : res
        }
        return make_response(jsonify(res2), 200)


class FirmOne(Resource):
    def get(self):
        us = user.User().userCurrObj()
        res = {
            'firm' : {},
            'message' : {}
        }
        if us.firm_id:
            d = firm.RSFirm()
            df = d.findFirmID(us.firm_id)
            if df:
                res['firm']['id'] = us.firm_id
                res['firm']['name'] = df.name
                res['firm']['full_name'] = df.full_name
                res['firm']['inn'] = df.inn
                res['firm']['email'] = df.email
                res['firm']['phone'] = df.phone
                res['firm']['reg_id'] = df.reg_id
                res['firm']['site'] = df.site

                if df.approved == 1:
                    res['message']['color'] = 'green'
                    res['message']['text'] = '???????? ?????????? ?????????????? ???????????????????????????? ??????????????????????'
                else:
                    res['message']['color'] = 'yellow'
                    res['message']['text'] = '???? ???? ??????????????????'
                #res['firm'][''] = df[]
            else:
                res['message']['color'] = 'red'
                res['message']['text'] = '?????? ????????????????'

        return make_response(jsonify(res), 200)

    def post(self):
        p2 = request.json

        d = firm.RSFirm()
        if d.checkForbid(p2['inn']):
            return make_response(jsonify('?????????????????????? ??????!'), 401)

        up = d.findFirm(p2['inn'])
        if not up:
            up = firm.RSFirm()

        up.name = p2['name']
        up.full_name = p2['name']
        up.inn = p2['inn']
        up.site = p2['site']
        up.reg_id = p2['region']['id']
        up.file = p2['fileInfo']['result']
        up.src = 'manual'
        up.approved = 0
        up.email = p2['email']
        up.phone = p2['telephone']

        d.saveFirm(up)
        oids = []
        for iz in p2['commodityGroup']:
            oids.append(iz['id'])
        d.savePG(up.id, oids)

        res1 = 'Saved'
        return make_response(jsonify(res1), 200)


#=========================================================
class FirmApprove(Resource):
    def get(self):
        fid = request.args.get('id')
        d = firm.RSFirm()
        d.approveFirm(fid)
        return make_response(jsonify('OK'), 200)


class FirmReject(Resource):
    def get(self):
        fid = request.args.get('id')
        reason = request.args.get('reason')
        d = firm.RSFirm()
        d.rejectFirm(fid, reason)
        return make_response(jsonify('OK'), 200)