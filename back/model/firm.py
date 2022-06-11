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


    def getFiltList(self, p_cat, p_reg, p_nam, p_inn, p_lim, p_off):
        ins_nam = ''
        if p_nam:
            ins_nam = " upper(name) like upper('%"+p_nam+"%') and"
        ins_inn = ''
        if p_inn:
            ins_inn = " inn like '%"+p_inn+"%' and"
        ins_lim = ''
        if p_lim:
            ins_lim = " limit " + p_lim + " "
        ins_off = ''
        if p_off:
            ins_off = " offset " + p_off + " "
        sql = f"""
                    select id, inn, name, full_name, site
                    from rs_firms
                    where {ins_nam} {ins_inn} 1=1
                    order by 1
                    {ins_lim} {ins_off}
                """
        myset = self.performToResult(sql)
        result_list = []
        for i in myset:
            result_list.append({'id': i[0], 'inn': i[1], 'name': i[2], 'full_name': i[3], 'site': i[4]})
        return result_list


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res