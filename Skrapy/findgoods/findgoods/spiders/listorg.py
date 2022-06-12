import scrapy
import re

#https://www.list-org.com/list?okved2=01.1&okato=45

class ListOrgSpiper(scrapy.Spider):
    name = 'list-org'
    start_urls = ['https://www.list-org.com/list?okved2=01.1&okato=45']

    custom_settings = {
        'ITEM_PIPELINES': {
            'pipelines.FindgoodsPipeline': 300,
        }
    }

    def parse(self, response):
        #content = response.css('div.content').extract()

        #pat = r'Всего организаций: \d+'
        #org_len = re.findall(r'\d+', re.search(pat, content).group(0))[0]

        #pg_count = round(int(org_len)/30)

        for link in response.css('div.org_list p a::attr(href)'):
            yield response.follow(link, callback=self.parse_suppliers)

        for i in range(2,100):
            next_page = f'https://www.list-org.com/list?okved2=01.1&okato=45&page={i}'
            yield response.follow(next_page, callback=self.parse)

    def parse_suppliers(self, response):

        if len(response.css('div.warn_red'))>0:
            return

        cards_site = response.css('div.card.w-100.p-1.p-lg-3.mt-2')

        base_okvd = ''
        okvds = ''

        for card in cards_site:
            card_title = card.css('h6.d-flex.card-title div::text').get().strip()
            if card_title=='Виды деятельности:':
                base_okvd = card.css('div a::text').get()

                okvds_list = card.css('div div')[1].css('tr')
                for okvd in okvds_list:
                    okvds = okvds + okvd.css('td::text')[0].get().strip()+','


        try:
            url = response.css('div.card.w-100.p-1.p-lg-3.mt-2')[0].css('p')[3].css('span::text').get().strip()
        except:
            url = 'Отсутствует'

        try:
            inn = response.css('div.card.w-100.p-1.p-lg-3.mt-1 tr')[2].css('td::text')[0].get().split('/')[0].strip()
        except:
            inn = 'Отсутствует'

        try:
            region = response.css('div.card.w-100.p-1.p-lg-3.mt-2')[0].css('p')[0].css('span.upper::text').get().split(',')[1].strip()
        except:
            region = 'Москва г'

        yield {
            'firm': response.css('div.card.w-100.p-1.p-lg-3.mt-1 tr')[0].css('a.upper::text').get().strip(),
            'url': url,
            'inn': inn,
            'region': region,
            'base_okvd': base_okvd,
            'okvds': okvds,
        }