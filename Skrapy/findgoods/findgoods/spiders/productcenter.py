import scrapy
import re

class ProductcenterSpiper(scrapy.Spider):
    name = 'productcenter'
    start_urls = ['https://productcenter.ru/producers/r-moskovskaia-obl-191']

    def parse(self, response):
        for link in response.css('div.cards a.link::attr(href)'):
            yield response.follow(link, callback=self.parse_suppliers)

        for i in range(2,107):
            next_page = f'https://productcenter.ru/producers/r-moskovskaia-obl-191/page-{i}'
            yield response.follow(next_page, callback=self.parse)

    def parse_suppliers(self, response):
        try:
            url = response.xpath('//*[@id="producer_link"]/text()').get().strip()
        except:
            url = 'Отсутствует'

        try:
            iv_about = str(response.css('div.iv_about').extract())
            pat = r'ИНН.*.\d{10}|\d{12}$'
            inn = re.findall(r'\d+', re.search(pat,iv_about).group(0))[0]
        except:
            inn = 'Отсутствует'

        yield {
            'firm': response.css('div.iv_content h1::text').get().strip(),
            'url': url,
            'inn': inn,
            'region': response.css('div.iv_content b.from_producer.grey_color::text').get().strip(),
        }
