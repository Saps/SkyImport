import scrapy
from scrapy.crawler import CrawlerProcess

import sys
sys.path.append('findgoods/findgoods/spiders')
sys.path.append('findgoods/findgoods')
from productcenter import ProductcenterSpiper
from listorg import ListOrgSpiper
from etpgpb_goods import GispSpiper
from yandex import YandexSpider

class BlogSpider(scrapy.Spider):
    name = 'blogspider'
    start_urls = ['https://www.zyte.com/blog/']

    custom_settings = {
        'ITEM_PIPELINES': {
            'pipelines.FindgoodsPipeline': 300,
        }
    }

    def parse(self, response):
        for title in response.css('.oxy-post-title'):
            yield {'title': title.css('::text').get()}

        for next_page in response.css('a.next'):
            yield response.follow(next_page, self.parse)


if __name__ == "__main__":
    process = CrawlerProcess()
    #process.crawl(BlogSpider)
    #process.crawl(ProductcenterSpiper)
    process.crawl(ListOrgSpiper)
    #process.crawl(YandexSpider)
    process.start()

