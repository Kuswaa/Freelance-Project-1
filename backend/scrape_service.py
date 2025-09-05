# scrape_service.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_data(query_type, query_value):
    """
    Main scraping logic. Logs in, navigates to BÚSQUEDA SIMPLE, performs query,
    and returns results as JSON.
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

        # 3. Wait for "BÚSQUEDA SIMPLE" to confirm login
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.LINK_TEXT, "BÚSQUEDA SIMPLE"))
        )

        # Click "BÚSQUEDA SIMPLE"
        driver.find_element(By.LINK_TEXT, "BÚSQUEDA SIMPLE").click()

        # 4. Wait for search input
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.NAME, "param"))
        )

        # 5. Perform search
        search_box = driver.find_element(By.NAME, "param")
        search_box.clear()
        search_box.send_keys(query_value)
        search_box.send_keys(Keys.RETURN)

        # Wait for results
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#results .d-flex.item"))
        )

        # 6. Extract results
        results = []
        items = driver.find_elements(By.CSS_SELECTOR, "#results .d-flex.item")

        for item in items:
            try:
                # Extract image from inline style
                preimage_div = item.find_element(By.CSS_SELECTOR, "div.preimage")
                style = preimage_div.get_attribute("style") if preimage_div else ""
                image = None
                if "url(" in style:
                    image = style.split("url(")[1].split(")")[0].strip("'\"")

                # Extract name + cedula
                links = item.find_elements(By.TAG_NAME, "a")
                name = links[0].text.strip() if len(links) > 0 else ""
                cedula = links[1].text.strip() if len(links) > 1 else ""
                href = links[0].get_attribute("href") if len(links) > 0 else ""

                # Build absolute link
                link = f"https://api.contek.com.do/web/{href}" if href else ""

                results.append({
                    "name": name,
                    "cedula": cedula,
                    "link": link,
                    "image": image
                })

            except Exception as e:
                print(f"⚠️ Skipping item due to error: {e}")
                continue

        return {
            "query_type": query_type,
            "query_value": query_value,
            "results": results
        }

    finally:
        driver.quit()
