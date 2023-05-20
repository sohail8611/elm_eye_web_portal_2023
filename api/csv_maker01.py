import base64
from datetime import datetime
from io import BytesIO
from flask import send_file
from db import *
import xlsxwriter


def make_csv_all_violation(userid, filter):
    response = {}
    try:
        # violation id
        # Violation Type Name
        # Street Name
        # Date
        # city
        # correct, incorrect, pending
        filter_ = ""
        if filter == "":
            filter_ = ""
        elif str(filter).lower() == 'correct':
            filter_ = " and violation.correct = 1 "
        elif str(filter).lower() == 'incorrect':
            filter_ = " and violation.correct = 0 "
        elif str(filter).lower() == 'pending':
            filter_ = " and violation.correct = -1 "
        else:
            filter_ = "and (violation.violation_id='" + filter + "' or LOWER(violation_type.violationname) LIKE '%" + filter + "%' or LOWER(street.streetname) LIKE '%" + filter + "%' or date_format(violation.violation_date, '%Y-%m-%d') = '" + filter + "' or LOWER(street.city) LIKE '%" + filter + "%' ) "
        violation_table_data = list()
        filter_city = "('')"
        cnx = db_connection()
        cursor_user = cnx.cursor()
        query = (
            "SELECT `user_id`,`city_allow` FROM `users` WHERE `user_id`="+str(userid)+";")
        cursor_user.execute(query)

        for a, b in cursor_user:
            allowed_cities = b.split(',')
            if len(allowed_cities) == 1:
                filter_city = "('"+allowed_cities[0]+"')"
            else:
                filter_city = str(tuple(allowed_cities))

        cursor_user.close()
        cursor = cnx.cursor()

        query = (
        "SELECT violation.violation_id, violation_type.violationname, street.streetname, violation.accurate, violation.risk, violation.violation_date, violation.violation_time, violation.correct, violation.device_id, violation.action_taken, violation.sensitivity, street.city, user_log.user_id, users.fullname, user_log.entry_date, violation.display_img,violation.lat, violation.long FROM violation INNER JOIN violation_type ON violation_type.violationtypeid = violation.violation_type_id INNER JOIN street ON street.streetid = violation.street_id LEFT JOIN user_log ON user_log.violation_id = violation.violation_id LEFT JOIN users ON users.user_id = user_log.user_id WHERE street.city in " + filter_city + " "+filter_+" ORDER BY violation.violation_id DESC;"
        )
        cursor.execute(query)

        for a, b, c, d, e, f, g, h, i, j, k, l, m, n, o,p,q,r in cursor:

            # violation.violation_id,       a
            # violation_type.violationname, b
            # street.streetname,            c
            # violation.accurate,           d
            # violation.risk,               e
            # violation.violation_date,     f
            # violation.violation_time,     g
            # violation.correct,            h
            # violation.device_id,          i
            # violation.action_taken,       j
            # violation.sensitivity         k
            # street.city,                  l
            # user_log.user_id,             m
            # users.fullname,               n
            # user_log.entry_date           o
            # display img                   p
            # lat                           q
            #lng                            r

            cs = "Not Reported"
            if j == 1:
                cs = "Reported"

            str0 = "Correct"
            if h == 0:
                str0 = "Incorrect"
            elif h == -1:
                str0 = "Pending"
            elif h == 2:
                str0 = "Duplicate"
            elif h == -2:
                str0 = "Duplicate Pending"

            ses = "High"
            if k == 0:
                ses = "Low"
            elif k == -1:
                ses = "-"
            userid = m
            fullname = n
            edit_date = o
            if userid == None:
                userid = '-'
                fullname = '-'
                edit_date = '-'

            # violation_table_data.append({
            #     "violation_id": a,
            #     "violationname": b,
            #     "streetname": c,
            #     "accurate": d,
            #     "risk": e,
            #     "violation_date": f.strftime('%b %d, %Y'),
            #     "violation_time": g.strftime('%H:%M'),
            #     "correct": str0,
            #     "device_id": i,
            #     "action_taken": cs,
            #     "sensitivity": ses,
            #     "city": l,
            #     "user_id": userid,
            #     "fullname": fullname,
            #     "edit_date": edit_date
            # })

            violation_table_data.append([str(a),str(b),str(c), str(l), str(d), str(e), str(q), str(r), str(f.strftime('%b %d, %Y'))
                                         , str(g.strftime('%H:%M')), str(str0), str(i), str(cs), str(ses), '=HYPERLINK("%s", "View Image")' % ("http://"+server+"/show_violation_image/"+str(p)), str(userid),
                                         str(fullname), str(edit_date)])
        cursor.close()
        cnx.close()
        header = [
                "Violation ID", # 0
                "Violation Type", # 1
                "Street Name", # 2
                "City", # 3
                "Accurate", # 4
                "Risk", # 5
                "Lat", # 6
                "Long", # 7
                "Date", # 8
                "Time", # 9
                "Correct Status", # 10
                "Device ID", # 11
                "Action Taken", # 12
                "Sensitivity", # 13
                "View Image", # 14
                "Reviewer ID", #15
                "Reviewer name", # 16
                "Review date" #17
        ]
        # with open('countries.csv', 'w', encoding='UTF8', newline='') as f:
        #     writer = csv.writer(f)
        #     writer.writerow(header)
        #     writer.writerows(violation_table_data)
        now = datetime.now()
        buffer = BytesIO()
        # workbook = xlsxwriter.Workbook('output_excel/ELM_Report_'+str(userid)+(now.strftime("%Y_%m_%d %H_%M"))+'.xlsx')
        workbook = xlsxwriter.Workbook(buffer)
        worksheet = workbook.add_worksheet()
        worksheet.set_column(0, 0, 10)
        worksheet.set_column(1, 1, 13)
        worksheet.set_column(2, 2, 17)
        worksheet.set_column(8, 8, 12)
        worksheet.set_column(10, 10, 14)
        worksheet.set_column(12, 12, 12)
        worksheet.set_column(13, 13, 11)
        worksheet.set_column(14, 15, 12)
        worksheet.set_column(16, 17, 15)


        worksheet.write_row(0, 0, header)
        r = 1
        for i in violation_table_data:
            worksheet.write_row(r, 0, i)
            r = r + 1
        workbook.close()
        buffer.seek(0)

        binaryFile = buffer.read()
        unicodeBase64File = base64.b64encode(binaryFile).decode('UTF-8')

        response = {'status': True, 'data': [unicodeBase64File], 'name': 'ELM_Report_'+str(userid)+(now.strftime("%Y_%m_%d %H_%M"))+'.xlsx', 'error': ''}
    except Exception as e:
        response = {'status': False, 'data': [unicodeBase64File],
                    'name': '', 'error': e}
    return response
