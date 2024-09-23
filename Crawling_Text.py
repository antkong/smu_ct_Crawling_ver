from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

chrome_driver_path = 'C:\chromedriver-win64\chromedriver.exe'

options = webdriver.ChromeOptions()

driver = webdriver.Chrome(service=Service(chrome_driver_path), options=options)

url = 'https://www.smu.ac.kr/kor/life/restaurantView.do'

try:
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    specific_divs = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'menu-list-box')))

    div_data = []
    for div in specific_divs:
        div_data.append(div.get_attribute('outerHTML'))

    data_dict = {'divs': div_data}

    with open('div_data.json', 'w', encoding='utf-8') as f:
        json.dump(data_dict, f, ensure_ascii=False, indent=4)

    print("Data has been successfully saved to 'div_data.json'.")

except Exception as e:
    print(f"An exception occurred: {e}")
finally:
    driver.quit()