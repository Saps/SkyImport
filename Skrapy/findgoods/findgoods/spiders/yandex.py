import scrapy
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import text
from selenium.webdriver.chrome.options import Options
import random

class YandexSpider(scrapy.Spider):
    name = 'yandex'
    base_url = 'https://yandex.ru'

    #inn = '7736168220'
    #firm_name = 'ооо "полиграфика"'
    dop_param = '"официальный сайт"'

    start_urls = []

    custom_settings = {
        'ITEM_PIPELINES' : {
        # 'findgoods.pipelines.FindgoodsPipeline': 300,
        'pipelines.YandexPipeline': 300,
        }
    }

    inns = []
    nams = []
    c_cnt = 0

    def __init__(self):
        self.cstring = 'mysql+pymysql://admin_sky:123456@185.221.152.242/admin_skyimport'
        self.engine = create_engine(self.cstring, pool_recycle=120, pool_pre_ping=True,
                                    connect_args={'connect_timeout': 10000})
        self.bdsession = sessionmaker(bind=self.engine, autocommit=True, autoflush=False)()
        self.connect = self.engine.connect()

        sql = f"""
                    select inn, name from rs_firms where approved=0 and src='crowling' and site is null
                """
        res1 = self.performToResult(sql)

        for r in res1:
            inn = r[0]
            self.inns.append(r[0])
            f_name = r[1]
            self.nams.append(r[1])
            self.start_urls.append(self.base_url+f'/search/?text={inn}+{f_name}+{self.dop_param}&lr=75')

        chrome_options = Options()

        chrome_options.headless = True

        #extension_path = r'/home/user/.config/chromium/Default/Extensions/cjpalhdlnbpafiamejdnhcphjbkeiagm/1.20.0_0'
        #chrome_options.add_extension(extension_path)

        service = Service(executable_path=ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, chrome_options=chrome_options)

        #self.driver = webdriver.Chrome(service=service)

    def parse_element(self):
        urls = ''

        elements = self.driver.find_elements(By.XPATH, '//ul[@class="serp-list serp-list_left_yes"]/li')
        for element in elements:
            elms_a = element.find_elements(By.TAG_NAME, 'a')
            for elm_a in elms_a:
                try:
                    cl_atr_elm_a = elm_a.get_attribute('class')
                    if cl_atr_elm_a == "Link Link_theme_normal OrganicTitle-Link organic__url link":
                        url = elm_a.get_attribute('href')
                        urls = urls + url+','
                except:
                    pass
        return urls

    def parse(self, response, **kwargs):

        self.driver.get(response.url)
        time.sleep(3)

        urls = ''

        urls = urls + self.parse_element()

        try:
            for i in range(1,3):
                button_next = self.driver.find_element(By.XPATH,
                    '//a[@class="link link_theme_none link_target_serp pager__item pager__item_kind_next i-bem"]')
                button_next.click()
                time.sleep(random.randint(5, 15))
                urls = urls + self.parse_element()
        except:
            pass

        self.driver.close()
        self.c_cnt = self.c_cnt + 1
        yield {
            'inn': self.inns[self.c_cnt-1],
            'firm': self.nams[self.c_cnt-1],
            'urls': urls,
        }


#        for i in range(1,2):
#            time.sleep(random.randint(5, 15))
#            next_page = response.url+f'&p={i}'
#            yield response.follow(next_page, callback=self.parse)

    def performToResult(self, sql_str):
        sql = text(sql_str)
        session = self.bdsession
        res = session.execute(sql).fetchall()
        return res

    def performWO(self, sql_str):
        sql = text(sql_str)
        session = self.bdsession
        session.execute(sql)
