from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from api import db_session

Base = declarative_base()

class RSRegion(Base):
    __tablename__ = 'rs_region'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    kladr_id = Column(Integer)


    def getList(self):
        sql = f"""
            select id, name, type, kladr_id
            from rs_region
            order by 1
        """
        myset = self.performToResult(sql)
        result_list = []
        for i in myset:
            result_list.append({'id':i[0], 'name':i[1], 'type':i[2], 'kladr_id':i[3]})
        return result_list

    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res