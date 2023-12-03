# Python program to read
# json file
import country_converter as coco
import json

# Opening JSON file
f = open('OverallOutputBubble2.json')

# returns JSON object as 
# a dictionary
data = json.load(f)


# Iterating through the json
# list
china = 0
final = []
for j in data['overall']:
	object = {}
	object1= {}
	hkg = 0
	twn = 0
	for i in j['coauthor']:
		print(i)
		standard_names = coco.convert(names=i['region'], to='ISO3')
		print(standard_names)
		if (standard_names=="TWN"  ):
			twn+=i['size']
		elif (standard_names=="HKG"):
			hkg+=i['size']
		else:
			object[standard_names]=i['size']
			object1[i['region']]=i['size']
	if hkg+twn>0:
		try:
			object["CHN"]=object["CHN"]+hkg+twn
			object1['China']=object1['China']+hkg+twn
		except:
			object["CHN"]=hkg+twn
			object1['China']=hkg+twn
	final.append({"id": j["id"], "coauthor": object, "coauthorLong": object1})
	

finalobject = {"data": final}
# Closing file
f.close()
print(final)
# some_names = ['United Rep. of Tanzania', 'DE', 'Cape Verde', '788', 'Burma', 'COG',
#               'Iran (Islamic Republic of)', 'Korea, Republic of',
#               "Dem. People's Rep. of Korea"]
# standard_names = coco.convert(names="china", to='ISO3')
# print(standard_names)
json_file_path_for_bubble = 'finalOutput0.json' 
with open(json_file_path_for_bubble, 'w') as json_file2:
    # Write the dictionary to the JSON file
    json.dump(finalobject, json_file2)