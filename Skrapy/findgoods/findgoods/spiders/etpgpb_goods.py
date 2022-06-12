import scrapy

class GispSpiper(scrapy.Spider):
    name = 'etpgpb_goods'
    start_urls = ['https://etpgpb.ru/suppliers/?is_manufacturer=true&regions%5B%5D=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&regions%5B%5D=%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C']

    def parse(self, response):
        for link in response.css('div.customers__container a::attr(href)'):
            yield response.follow(link, callback=self.parse_suppliers)

        for i in range(2,26):
            next_page = f'https://etpgpb.ru/suppliers/?is_manufacturer=true&page={i}&regions%5B%5D=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&regions%5B%5D=%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C'
            yield response.follow(next_page, callback=self.parse)

    def parse_suppliers(self, response):
        yield {
            'firm': response.css('div.customerPrivate-content__section h1.title::text').get().strip(),
            'url': response.url,
            'inn': response.css('div.customers__cell.customers__cell--inn::text').get().strip(),
        }

