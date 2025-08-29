# app/scraper.py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time

URL = "https://api.contek.com.do/web/index.php"
USERNAME = "nellk"
PASSWORD = "p0cho"

def init_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # comment this line to see the browser
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def login(driver):
    driver.get(URL)
    time.sleep(2)
    driver.find_element(By.NAME, "user").send_keys(USERNAME)
    driver.find_element(By.NAME, "pass").send_keys(PASSWORD + Keys.RETURN)
    time.sleep(3)

def go_to_simple_search(driver):
    driver.find_element(By.LINK_TEXT, "BÚSQUEDA SIMPLE").click()
    time.sleep(2)

def search(driver, query_type, query_value):
    search_box = driver.find_element(By.NAME, "param")
    search_box.clear()
    search_box.send_keys(query_value + Keys.RETURN)
    time.sleep(3)

    results = []
    items = driver.find_elements(By.CSS_SELECTOR, "#results .d-flex.item")

    for item in items:
        try:
            name = item.find_element(By.CSS_SELECTOR, "div > div > a").text.strip()
            cedula = item.find_elements(By.CSS_SELECTOR, "div > div > a")[1].text.strip()
            link = item.find_elements(By.CSS_SELECTOR, "div > div > a")[0].get_attribute("href")
            results.append({"name": name, "cedula": cedula, "link": link})
        except Exception as e:
            print(f"Skipping item due to error: {e}")
            continue
    return results

def run_scraper(query_type, query_value):
    driver = init_driver()
    try:
        login(driver)
        go_to_simple_search(driver)
        return search(driver, query_type, query_value)
    finally:
        driver.quit()
