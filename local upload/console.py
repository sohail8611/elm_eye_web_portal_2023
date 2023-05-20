import cv2
import base64
import csv
from upload_api_03 import *

filename_upload = input("Input filename (name.csv): ")
uploading_date = input("Input Date (YYYY-MM-DD): ")
city_name = ""
while True:
    city_name = input("Input City (Riyadh, Makkah): ")
    if city_name == "Riyadh" or city_name == "Makkah":
        break
    print("Incorrect City Name!")

print("\nSetting up violations!!")

violation_list = []
invalid_violation = []
try:
    with open(filename_upload, 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        fields = next(csvreader)

        for vio in csvreader:
            if str(vio[2]) == '' and str(vio[0]) == '':
                break
            try:
                img = cv2.imread('to_upload_img/'+str(vio[2])+".jpg")
                string_img = base64.b64encode(
                    cv2.imencode('.jpg', img)[1]).decode()

                if vio[0] == "" or vio[0] == None or vio[0] == " ":
                    raise Exception("Empty Type")

                if float(vio[1]) < 0 or float(vio[1]) > 100:
                    raise Exception("Accurate Error")

                temp = {
                    "street_id": 0,
                    "street_name": "",

                    "violation_type_id": 0,
                    "violation": vio[0],

                    "details": "Tree",
                    "accurate": vio[1],
                    "risk": 0,
                    "display_img": str(vio[2]) + ".jpg",
                    "string_img": string_img,

                    "lat": float(vio[3].split(',')[0]),
                    "lng": float(vio[3].split(',')[1]),

                    "violation_date": uploading_date,
                    "violation_time": "14:15",
                    "operation_id": vio[5],
                    "correct": 1,
                    "device_id": 1,
                    "polygon_img": "0",
                    "super_violation_id": 0,
                }
                violation_list.append(temp)

            except Exception as e:
                img_binaryData = ""
                try:
                    with open('to_upload_img/' + str(vio[2]) + ".jpg", 'rb') as file:
                        img_binaryData = base64.b64encode(file.read())
                except Exception as ee:
                    img_binaryData = ""

                temp = {
                    "operation_id": vio[5],
                    "frame_id": "",
                    "case_type": vio[0],
                    "accurate": vio[1],
                    "track_id":"",
                    "_date": uploading_date,
                    "_time": "14:15",
                    "lat": str(vio[3].split(',')[0]),
                    "lng": str(vio[3].split(',')[1]),
                    "string_img": img_binaryData,
                    "city": city_name
                }
                invalid_violation.append(temp)
except OSError:
    # print(e)
    print("Failed to setup violations!!!!!")
    input('Press any key to exit!!')
    exit()
except FileNotFoundError:
    # print(e)
    print("Failed to setup violations!!!!!")
    input('Press any key to exit!!')
    exit()

print("Ready to GO!!")
try:
    print("\nTimer Started!!")
    x = time.perf_counter()
    print("Processing Please Wait.............\n")
    pending = main_function(violation_list, uploading_date, city_name, invalid_violation)
    print("\nProcessing Complete.")
    print("\tTime Consume in Sec: ", time.perf_counter() - x)

except NameError:
    print(NameError)
    print("Failed in processing!!!!!")
    input('Press any key to exit!!')
    exit()

try:
    if len(pending) > 0:
        now = datetime.now()
        current_time = now.strftime("%b_%d_%Y_%H_%M_%S")

        filename = current_time+".csv"
        with open('pending/'+filename, 'w', newline='') as csvfile:
            csvwriter = csv.writer(csvfile)
            csvwriter.writerow(["Violation Type", "Accurate",
                               "Display img(without .jpg)", "lat, long", "Date (YYYY-MM-DD)","operation_id", "City"])
            for i in pending:
                csvwriter.writerow([i['violation'], i['accurate'], i['display_img'].split('.')[
                                   0], str(i['lat'])+','+str(i['long']), i['violation_date'],i['"operation_id"'], city_name])

        print("Pending Violations has been saved to pending/", filename)
except NameError:
    print(NameError)
    print("Failed in writing pending violations!!!!!")
input('Press any key to exit!!')
exit()
