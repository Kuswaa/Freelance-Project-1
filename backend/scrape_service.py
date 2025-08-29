# scrape_service.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

def scrape_data(query_type, query_value):
    """
    Main scraping logic. Logs in, searches, and returns results as JSON.
    """

    # Configure Chrome
    options = Options()
    options.add_argument("--headless")  # run without opening browser
    options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=options)

    try:
        # 1. Go to login page
        driver.get("https://api.contek.com.do/web/index.php")

        # 2. Login
        driver.find_element(By.NAME, "user").send_keys("nellk")
        driver.find_element(By.NAME, "pass").send_keys("p0cho")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)

        # 3. Perform search
        search_box = driver.find_element(By.NAME, "param")  # <-- always "param"
        search_box.clear()
        search_box.send_keys(query_value)
        search_box.send_keys(Keys.RETURN)
        time.sleep(3)

        # 4. Extract results
        results = []
        items = driver.find_elements(By.CSS_SELECTOR, "#results .d-flex.item")

        for item in items:
            try:
                name = item.find_element(By.CSS_SELECTOR, "div > div > a").text.strip()
                cedula = item.find_elements(By.CSS_SELECTOR, "div > div > a")[1].text.strip()
                link = item.find_elements(By.CSS_SELECTOR, "div > div > a")[0].get_attribute("href")

                results.append({
                    "name": name,
                    "cedula": cedula,
                    "link": link
                })
            except Exception as e:
                print(f"Skipping item due to error: {e}")
                continue


        return results

    finally:
        driver.quit()
