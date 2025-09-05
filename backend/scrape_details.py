from flask import Blueprint, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

details_bp = Blueprint("details", __name__)

def init_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    return driver

@details_bp.route("/details", methods=["POST"])
def scrape_details():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing URL"}), 400

    print("🔹 Fetching details for URL:", url)
    driver = init_driver()
    details = {}
    wait = WebDriverWait(driver, 15)  # wait up to 15 seconds for elements

    try:
        driver.get(url)

        # --- Name & Cedula ---
        try:
            name_el = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h5.card-title div:nth-child(1)")))
            details["name"] = name_el.text
        except:
            details["name"] = "N/A"

        try:
            cedula_el = driver.find_element(By.CSS_SELECTOR, "h5.card-title div:nth-child(2)")
            details["cedula"] = cedula_el.text
        except:
            details["cedula"] = "N/A"

        # --- Image ---
        try:
            foto_el = driver.find_element(By.CSS_SELECTOR, ".foto")
            bg = foto_el.value_of_css_property("background-image")
            details["image"] = bg.replace('url("', '').replace('")', '').replace("'", "")
        except:
            details["image"] = ""

        # --- Generales section ---
        generales = {}
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#generales")))
            rows = driver.find_elements(By.CSS_SELECTOR, "#generales .row")
            print(f"📝 Found {len(rows)} generales rows")
            for row in rows:
                try:
                    title = row.find_element(By.CSS_SELECTOR, ".title").text
                    subtitle = row.find_element(By.CSS_SELECTOR, ".subtitle").text
                    generales[title] = subtitle
                except:
                    continue
        except:
            pass
        details["generales"] = generales

        # --- Phones section ---
        phones = []
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#telefonos tbody tr")))
            phone_rows = driver.find_elements(By.CSS_SELECTOR, "#telefonos tbody tr")
            print(f"📝 Found {len(phone_rows)} phone rows")
            for tr in phone_rows:
                try:
                    cols = tr.find_elements(By.TAG_NAME, "td")
                    phones.append({
                        "telefono": cols[0].text if len(cols) > 0 else "",
                        "tipo": cols[1].text if len(cols) > 1 else "",
                        "suplidor": cols[2].text if len(cols) > 2 else "",
                    })
                except:
                    continue
        except:
            pass
        details["telefonos"] = phones

        print("✅ Details scraped successfully")
        return jsonify(details)

    except Exception as e:
        import traceback
        print("❌ Error scraping details:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        driver.quit()
