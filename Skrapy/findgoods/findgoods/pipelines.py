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

        if item['region'].upper().find('МОСКВА') == -1:
            return item

        finn = item['inn']
        sql1 = f"""
        select count(*) cnt from dual
            where '{finn}' in (
                select inn from rs_firms
                union
                select inn from rs_rejected_inn)
        """
        rs = self.performToResult(sql1)
        if rs[0][0] > 0:
            return item  # не пригодилась ворона

        fname = item['firm']
        fsite = item['url']
        fokv = item['base_okvd']
        email = item['email']
        phone = item['phone']
        sql2 = f"""
            insert into rs_firms (inn, name, full_name, site, src, okveds, email, phone)
            values ('{finn}', '{fname}', '{fname}', '{fsite}', 'crowling', '{fokv}', '{email}', '{phone}')
        """
        self.performWO(sql2)
        return item

    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = self.bdsession
        res = session.execute(sql).fetchall()
        return res

    def performWO(self, sql_str):
        sql = text(sql_str)
        session = self.bdsession
        session.execute(sql)


class YandexPipeline:
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
        iu = item['urls']
        inn = item['inn']
        sql = f"""
            update rs_firms set site = '{iu}' where inn = '{inn}'
        """
        self.performWO(sql)
        return item

    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = self.bdsession
        res = session.execute(sql).fetchall()
        return res

    def performWO(self, sql_str):
        sql = text(sql_str)
        session = self.bdsession
        session.execute(sql)