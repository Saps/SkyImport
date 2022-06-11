from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from api import db_session

Base = declarative_base()

class RSOkved2(Base):
    __tablename__ = 'rs_okved2'
    id = Column(Integer, primary_key=True)
    letter = Column(String)
    code = Column(String)
    name = Column(String)


    def getList(self):
        sql = f"""
            select *
            from rs_okved2
            order by 2,3
        """
        myset = self.performToResult(sql)
        result_list = []
        for i in myset:
            result_list.append({'id':i[0], 'letter':i[1], 'code':i[2], 'name':i[3]})
        return result_list

    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res