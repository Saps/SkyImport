import scrapy
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time


class YandexSpider(scrapy.Spider):
    name = 'yandex'
    base_url = 'https://yandex.ru'

    inn = '7736168220'
    firm_name = 'ооо "полиграфика"'
    dop_param = '"официальный сайт"'

    start_urls = [base_url+f'/search/?text={inn}+{firm_name}+{dop_param}&lr=75']

    def __init__(self):
        service = Service(executable_path=ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)

    def parse(self, response, **kwargs):

        self.driver.get(response.url)
        time.sleep(3)

        elements = self.driver.find_elements(By.XPATH, '//ul[@class="serp-list serp-list_left_yes"]/li')

        urls = ''

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

        self.driver.close()

        yield {
            'inn': self.inn,
            'firm': self.firm_name,
            'urls': urls,
        }

