from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from api import db_session

Base = declarative_base()

class RSProdGroup(Base):
    __tablename__ = 'rs_prod_groups'
    id = Column(Integer, primary_key=True)
    tov_class = Column(String)
    tov_group = Column(String)

    def getList(self):
        sql = f"""
            select id, tov_class, tov_group
            from rs_prod_groups
            order by 2,3
        """
        myset = self.performToResult(sql)
        result_list = []
        for i in myset:
            result_list.append({'id':i[0], 'tov_class':i[1], 'tov_group':i[2]})
        return result_list


    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = db_session()
        res = session.execute(sql).fetchall()
        return res