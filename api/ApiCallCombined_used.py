
import json
import requests
from requests.structures import CaseInsensitiveDict

def apicallcombined_used(violation):
    if violation['city'] == "Riyadh":
        try:
            headers = {
                'api_key': 'F9378702872B02F8E053280C780A2AF1'
            }

            data = {
                "Bboxes": "[0, 0, 0, 0]",
                "OperationId": str(violation['op_id']),
                "FrameId": 17,
                "Case": violation['case'],
                "Confidence": float(violation['Confidence'])/100,
                "RleMask": "{'size': [1080, 1920], 'counts': b'jX]n0<\\Q10O4M00002N000000002N001O002N00001O000000001O0000002N00001O000000001O002N001O00001O000000011N0000001O0001O0001O00002N001O001O000000002N00001O001O002N000000003M000000001O001O00020N001O0001O0001O002N000000000000001O001O011N00001O02N000001O002N001O00001O000000002N010O000000001O000000011N000002N00001fN]PO=co0C]PO=fo0_O]PO?co0A]PO?co0A]PO?ko0UO[POi0eo0WO[POi0gP1@30mPek0'}",
                "TrackId": 15,
                "Date": violation['date'],
                "Time": violation['time'],
                "Latitude": violation['long'],
                "Longitude": violation['lat'],
                "Speed": "10",
                "Image": violation['display_img']
            }

            url = "https://ejadh.alriyadh.gov.sa/DMZ_Stage/AITruckerService.svc/rest/CreateTicket"
            # url = "http://ejadh.alriyadh.gov.sa/DMZ_Stage/AITruckerService.svc/rest/CreateTicket"
            response = requests.post(url, headers=headers, json=data)

            print('Response status code:', response.status_code)
            print('Response content:', response.content)
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            print(e)
            return False

    else:
        try:
            url = 'http://yxdemo.eastus.cloudapp.azure.com/Check/POC/tabukm/API/token'

            head = {'Content-Type': 'application/x-www-form-urlencoded'}
            auth_info = {'username': 'automaticinspection',
                         'password': '123456',
                         'grant_type': 'password'
                         }
            r = requests.post(url, auth_info, head)

            response = json.loads(r.text)
            token = response['access_token']
            response_dict = {"status_code": r.status_code, "access_token": token}


            ############################ POST REQUEST FOR DATA USING THE TOKEN GENERATED ######################

            url = 'http://yxdemo.eastus.cloudapp.azure.com/Check/POC/tabukm/API/api/AutomaticInspection/CreateInspection'

            headers = CaseInsensitiveDict()
            headers["Authorization"] = "Bearer "+response_dict['access_token']
            # headers["Content-Type"] = "application/json"

            data ={
            "OperationId": str(violation['op_id']),
              "FrameId": 17,
              "Case": violation['case'],
              "TrackId": 15,
              "Long": violation['long'],
              "Lat": violation['lat'],
              "Date": violation['date'],
              "Time": violation['time'],
              "Speed": 0,
              "Temprature": "37",
              "Image": violation['display_img']
            }

            resp = requests.post(url, headers=headers, data=data)

            response_dict = {
                "status_code": resp.status_code,
                "Success": resp.json()['Success'],
                "Data": resp.json()['Data']
            }
            print(response_dict["Success"])
            return response_dict["Success"]
        except Exception as e:
            print(e)
            return False








