import pandas
import csv
import json
import math

# open a file, where you stored the pickled data
file = open('cse_gs.pkl', 'rb')

# dump information to that file
data = pandas.read_pickle(file)

# close the file
file.close()

print('Showing the pickled data:', data.loc[40]  )

print("coauthor")

coauthor_data = pandas.read_csv("coauthor_all_details.csv")

# View the first 5 rows
print(coauthor_data.head())

temp = data.loc[1] 

array = []
countFound = 0
countCoauthor =0
ustprofs =[]
ustprofsAddress =[]
for index1 in range(len(data.index)):
    ustprofs.append(data.loc[index1]['scholar_id'])
    
print(ustprofs)
countUSTCoauthor=0

separated = []
for index1 in range(len(data.index)):
    eachprof = []
    
    for index, item in enumerate(data.loc[index1]['coauthors']):
        isUST=False
        countCoauthor+=1
        for ustprof in ustprofs:
            if ustprof == item['scholar_id']:
                isUST=True
                countUSTCoauthor+=1
                print("ustprof here: ",countUSTCoauthor ,item['scholar_id'])
                
        if isUST==False:
            
            for index, coauthor in coauthor_data.iterrows():
            # for coauthor in coauthor_data:
                # print(coauthor['scholar_id'])
                if item['scholar_id'] == coauthor['scholar_id']:
                    # print("found!", " Lat:", coauthor['Lat'], " Long:" , coauthor['Long'])
                    countFound+=1
                    array.append({
                        
                        "region": coauthor['org_country']
                    })
                    eachprof.append({
                        
                        "region": coauthor['org_country']
                    })
    separated.append({"coauthor": eachprof, "id":data.loc[index1]['scholar_id']})
print ("separated",separated)


json_file_path = 'OverallOutput.json'  # Replace with your desired file path
json_file_path_for_bubble = 'OverallOutputBubble2.json'  # Replace with your desired file path



hkLatLong = {
        "Lat" : 22.396427,
        "Long" : 114.109497
    } 

output = {
    "author" : []
}


# bubble map
bubbleArray = [
    {"region":"Hong Kong","long": hkLatLong['Long'], "lat": hkLatLong['Lat'], "group": "A", "size": 0}
]
count =0
for i in array:
    
    if i['region'] and not type(i['region'])==float :
    
        count+=1
      
        
        exist = False
        for index, bubble in enumerate(bubbleArray):
            
            if bubble['region'] == i['region'] :
                bubble['size'] += 1
                exist = True
        if exist==False:
            
            print(index )
            bubbleArray.append(
                {"size": 1, "region":i['region']}
                )
            
final = []
for x in separated:
    temp = []
    for i in x['coauthor']:
        
        if i['region'] and not type(i['region'])==float :
        
            count+=1
        
            
            exist = False
            for index, bubble in enumerate(temp):
                
                if bubble['region'] == i['region'] :
                    bubble['size'] += 1
                    exist = True
            if exist==False:
                
                print(index )
                temp.append(
                    {"size": 1, "region":i['region']}
                    )
    final.append({"id": x['id'], "coauthor":temp})
    
print("final", final)
print("output",output)
print("bubbleArray", bubbleArray)
print("countValid", count)
print("countFound", countFound)
print("countCoauthor", countCoauthor)
bubbleArrayObject = {
    "overall" : bubbleArray
}
finalArrayObject =  {
    "overall" : final
}


# Open the file in write mode



# with open(json_file_path_for_bubble, 'w') as json_file2:
#     # Write the dictionary to the JSON file
#     json.dump(bubbleArrayObject, json_file2)
with open(json_file_path_for_bubble, 'w') as json_file2:
    # Write the dictionary to the JSON file
    json.dump(finalArrayObject, json_file2)
