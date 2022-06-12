from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.ext.declarative import declarative_base
# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class FindgoodsPipeline:
    def __init__(self):
        """
        Initializes database connection and sessionmaker
        Creates tables
        """
        self.cstring = 'mysql+pymysql://admin_sky:123456@185.221.152.242/admin_skyimport'
        self.engine = create_engine(self.cstring, pool_recycle=120, pool_pre_ping=True,
                                    connect_args={'connect_timeout': 10000})
        self.bdsession = sessionmaker(bind=self.engine, autocommit=True, autoflush=False)()
        self.connect = self.engine.connect()


    def process_item(self, item, spider):
        it = item['title']
        sql_str = f"""
                    insert into proba(name) values ('{it}')
                """
        sql = text(sql_str)
        session = self.bdsession
        session.execute(sql)
        return item
