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

_driver = None  # global singleton driver


def init_driver():
    """Initialize Chrome driver with options."""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # remove this line if you want browser visible
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver


def login(driver):
    """Perform login into the target website."""
    driver.get(URL)
    time.sleep(2)

    driver.find_element(By.NAME, "user").send_keys(USERNAME)
    driver.find_element(By.NAME, "pass").send_keys(PASSWORD + Keys.RETURN)
    time.sleep(3)


def get_driver():
    """Return a logged-in driver instance (singleton)."""
    global _driver
    if _driver is None:
        _driver = init_driver()
        login(_driver)
    return _driver


def go_to_simple_search(driver):
    """Navigate to the simple search page."""
    driver.find_element(By.LINK_TEXT, "BÚSQUEDA SIMPLE").click()
    time.sleep(2)


def search(driver, query_type, query_value):
    """Perform search and extract results."""
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

            # Normalize link
            if not link.startswith("http"):
                link = "https://api.contek.com.do/web/" + link

            results.append({"name": name, "cedula": cedula, "link": link})
        except Exception as e:
            print(f"⚠️ Skipping item due to error: {e}")
            continue
    return results
