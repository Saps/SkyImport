from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from api import db_session

Base = declarative_base()

class RSFirm(Base):
    __tablename__ = 'rs_firms'
    id = Column(Integer, primary_key=True)
    inn = Column(String)
    name = Column(String)
    full_name = Column(String)
    site = Column(String)
    reg_id = Column(Integer)
    approved = Column(Integer)
    src = Column(String)
    file = Column(String)
    email = Column(String)
    phone = Column(String)


    def getList(self):
        sql = f"""
            select id, inn, name, full_name, site
            from rs_firms
            order by 1
        """
        myset = self.performToResult(sql)
        result_list = []
        for i in myset:
            result_list.append({'id':i[0], 'inn':i[1], 'name':i[2], 'full_name':i[3], 'site':i[4]})
        return result_list


    def getFiltList(self, p_cat, p_reg, p_nam, p_inn, p_prodname, p_lim, p_off, p_app):
        ins_nam = ''
        if p_nam:
            ins_nam = " upper(full_name) like upper('%"+p_nam+"%') and"
        ins_inn = ''
        if p_inn:
            ins_inn = " inn like '%"+p_inn+"%' and"

        ins_cat = ''
        if p_cat:
            ins_cat = " id in (select firm_id from rs_pg_firm where pg_id = "+p_cat+") and"
        ins_reg = ''
        if p_reg:
            ins_reg = " reg_id = " + p_reg + " and"

        ins_prod = ''
        if p_prodname:
            ins_prod = " id in (select pf.firm_id from rs_prod_firms pf, rs_products p "+\
                       "where pf.prod_id = p.id and upper(p.name) like upper('%"+p_prodname+"%')) and"

        ins_lim = ''
        if p_lim:
            ins_lim = " limit " + p_lim + " "
        ins_off = ''
        if p_off:
            ins_off = " offset " + p_off + " "
        sql = f"""
                    select id, inn, name, full_name, site, email, phone, src
                    from rs_firms
                    where {ins_nam} {ins_inn} {ins_cat} {ins_reg} {ins_prod} approved = {p_app}
                    order by 1
                    {ins_lim} {ins_off}
                """

        sqlc = f"""
                    select count(*) as cnt
                    from rs_firms
                    where {ins_nam} {ins_inn} {ins_cat} {ins_reg} {ins_prod} approved = {p_app}
                    order by 1
                """

        myset = self.performToResult(sql)
        cset = self.performToResult(sqlc)

        cn = cset[0][0]

        result_list = []
        for i in myset:
            result_list.append({'id': i[0], 'inn': i[1], 'name': i[2], 'full_name': i[3], 'site': i[4],
                                'email': i[5], 'phone': i[6], 'src':i[7] })
        return cn, result_list


    def checkForbid(self, m1):
        mm1 = m1
        sql_text = f"""
            select count(*) r1 from rs_rejected_inn where inn = '{mm1}'
        """
        r = self.performToResult(sql_text)
        r3 = r[0][0]
        if r3 > 0:
            return True
        return False


    def findFirm(self, inn):
        sess = db_session()
        uc = sess.query(RSFirm).filter(RSFirm.inn == inn).first()
        return uc


    def findFirmID(self, id):
        sess = db_session()
        uc = sess.query(RSFirm).filter(RSFirm.id == id).first()
        return uc


    def saveFirm(self, firm):
        sess = db_session()
        sess.add_all([firm])
        sess.flush()


    def savePG(self, id, pgids):
        sql1 = f"""
            delete from rs_pg_firm where firm_id = {id}
        """
        self.performWO(sql1)
        for pgg in pgids:
            sql2 = f"""
                insert into rs_pg_firm (firm_id, pg_id) values ({id}, {pgg})
            """
            self.performWO(sql2)


    def approveFirm(self, fid):
        d = self.findFirmID(fid)
        d.approved = 1
        self.saveFirm(d)
        # функционал по разбору файла Base64 и внесению товаров в базу


    def rejectFirm(self, fid, reason):
        d = self.findFirmID(fid)
        finn = d.inn
        sql1 = f"""
                insert into rs_rejected_inn (inn, reason, old_id) values ('{finn}', '{reason}', {fid})
            """
        self.performWO(sql1)
        sql2 = f"""
                        delete from rs_firms where id = {fid}
                    """
        self.performWO(sql2)


#======================================================================================================
    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res


    def performWO(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        session.execute(sql)
