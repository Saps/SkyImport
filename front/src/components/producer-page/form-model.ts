export const formModel = {
    producerName: {
        name: 'name',
        label: 'Название производителя*',
        requiredErrorMsg: 'Введите название производителя',
    },
    inn: {
        name: 'inn',
        label: 'ИНН*',
        requiredErrorMsg: 'Введите ИНН',
        invalidErrorMsg: 'Неправильный ИНН (пример: 4816523659687452)',
    },
    region: {
        name: 'region',
        label: 'Регион*',
        requiredErrorMsg: 'Укажите регион',
    },
    commodityGroup: {
        name: 'commodityGroup',
        label: 'Товарная группа*',
        requiredErrorMsg: 'Введите товарную группу',
    },
    site: {
        name: 'site',
        label: 'Ссылка на сайт',
        requiredErrorMsg: 'Укажите ссылку на сайт',
    },
    csvInfo: {
        name: 'csvInfo',
        label: 'Данные в формате CSV*',
        requiredErrorMsg: 'Загрузите файл в формате CSV',
    }
};
