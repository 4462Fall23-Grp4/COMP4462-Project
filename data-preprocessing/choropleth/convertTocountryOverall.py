# Python program to read
# json file
import country_converter as coco
import json

# Opening JSON file
f = open('OverallOutputBubble1.json')

# returns JSON object as 
# a dictionary
data = json.load(f)
object = {}

# Iterating through the json
# list
for i in data['overall']:
	print(i)
	standard_names = coco.convert(names=i['region'], to='ISO3')
	print(standard_names)
	object[standard_names]=i['size']

# Closing file
f.close()
print(object)
# some_names = ['United Rep. of Tanzania', 'DE', 'Cape Verde', '788', 'Burma', 'COG',
#               'Iran (Islamic Republic of)', 'Korea, Republic of',
#               "Dem. People's Rep. of Korea"]
# standard_names = coco.convert(names="china", to='ISO3')
# print(standard_names)