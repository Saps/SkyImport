from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


def db_connect():
    return Mydb.connect

def db_session():
    return Mydb.bdsession

def db_engine():
    return Mydb.engine

class Db:
    def __init__(self):
        self.cstring = 'mysql+pymysql://admin_sky:123456@185.221.152.242/admin_skyimport'
        self.engine = create_engine(self.cstring, pool_recycle=1800, connect_args={'connect_timeout': 10000})
        self.bdsession = sessionmaker(bind=self.engine, autocommit=True, autoflush=False)()
        self.connect = self.engine.connect()



Mydb = Db()





