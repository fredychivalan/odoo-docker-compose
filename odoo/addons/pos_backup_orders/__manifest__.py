# -*- coding: utf-8 -*-
# License: OPL-1
{
    'name': "POS Backup Orders",
    'version': '1.0',
    'category': 'Point of Sale',
    'author': 'TL Technology',
    'sequence': 0,
    'summary': 'Module can help you backup/restore orders on pos screen via JSON file or Postgres database',
    'description': """
    If your internet have some problem, have many pending orders still on pos screen, and could not push to backend \n
    And you worries lost orders, module can help you backup orders to file JSON \n
    And so when internet come back and work well, you can restore file JSON and push orders to backend.
    ....
    """,
    'depends': ['point_of_sale'],
    'data': [
        'template/template.xml',
        'views/PosConfig.xml'
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'price': '50',
    'website': 'http://posodoo.com',
    "currency": 'EUR',
    'application': True,
    'images': ['static/description/icon.png'],
    'support': 'thanhchatvn@gmail.com',
    "license": "OPL-1"
}
