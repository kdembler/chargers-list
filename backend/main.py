#!/usr/bin/env python3

from flask import Flask, jsonify
from flask_cors import cross_origin
import requests

app = Flask(__name__)

cities_of_interest = ['Białystok', 'Bydgoszcz', 'Gdańsk', 'Gorzów Wielkopolski', 'Katowice', 'Kielce', 'Kraków', 'Lublin', 'Łódź', 'Olsztyn', 'Opole', 'Poznań', 'Rzeszów', 'Szczecin', 'Toruń', 'Warszawa', 'Wrocław', 'Zielona Góra']

diacritic_normalizer_dict = {
  'ą': 'a',
  'ć': 'c',
  'ę': 'e',
  'ł': 'l',
  'ń': 'n',
  'ó': 'o',
  'ś': 's',
  'ź': 'z',
  'ż': 'z'
}

def get_normalized_text(text):
  output = text.lower()
  for original, replacement in diacritic_normalizer_dict.items():
    output = output.replace(original, replacement)
  return output

def create_charger_object(raw_charger):
  charger = {}

  address_info = raw_charger['addressInfo']
  address = address_info['addressLine1']
  if address_info['addressLine2']:
    address = '{}, {}'.format(address, address_info['addressLine2'])
  charger['location'] = {
    'address': address,
    'contact': {
      'email': address_info['contactEmail'],
      'phone': address_info['contactTelephone1'],
      'website': address_info['relatedURL']
    },
    'title': address_info['title']
  }

  usage_type = raw_charger['usageType']
  charger['usageRestrictions'] = {
    'accessKeyRequired': usage_type['isAccessKeyRequired'],
    'membershipRequired': usage_type['isMembershipRequired'],
    'paidAtLocation': usage_type['isPayAtLocation'],
    'comment': usage_type['title']
  }

  connections = raw_charger['connections']
  highest_power_connection = connections[0]
  for connection in connections[1:]:
    if highest_power_connection['powerKW'] and connection['powerKW'] > highest_power_connection['powerKW']:
      highest_power_connection = connection

  charger['connection'] = {
    'currentType': highest_power_connection['currentType'] and highest_power_connection['currentType']['title'],
    'power': highest_power_connection['powerKW'],
    'type': highest_power_connection['connectionType'] and highest_power_connection['connectionType']['title']
  }

  operator = raw_charger['operatorInfo']
  charger['operator'] = {
    'title': operator['title'],
    'website': operator['websiteURL']
  }

  charger['info'] = {
    'status': raw_charger['statusType']['title'],
    'comment': raw_charger['generalComments']
  }

  return charger


def filter_and_parse_chargers(chargers):
  normalized_cities_of_interest_dict = {}
  for city in cities_of_interest:
    normalized_city = get_normalized_text(city)
    normalized_cities_of_interest_dict[normalized_city] = city

  chargers_per_city = {}

  for raw_charger in chargers:
    raw_town = str(raw_charger['addressInfo']['town'])
    normalized_town = get_normalized_text(raw_town)

    if normalized_town not in normalized_cities_of_interest_dict:
      continue

    if normalized_town not in chargers_per_city:
      chargers_per_city[normalized_town] = {'displayName': normalized_cities_of_interest_dict[normalized_town], 'chargers': []}

    charger = create_charger_object(raw_charger)
    chargers_per_city[normalized_town]['chargers'].append(charger)

  return chargers_per_city

@app.route('/v1/cities')
@cross_origin()
def get_cities():
  response = requests.get('https://api.openchargemap.io/v3/poi/?output=json&countrycode=PL&camelcase=true')
  chargers = response.json()
  parsed_chargers = filter_and_parse_chargers(chargers)
  return jsonify(cities=parsed_chargers)


app.run(host='0.0.0.0', debug=True)
