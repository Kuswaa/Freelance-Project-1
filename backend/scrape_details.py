# scrape_details.py
import time
from flask import Blueprint, request, jsonify
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from app.scraper import get_driver

details_bp = Blueprint("details", __name__)

def scrape_details(detail_url: str):
    """Scrape a person's details using Selenium."""
    driver = get_driver()
    data = {
        "name": "N/A",
        "cedula": "N/A",
        "image": "/assets/no_user.png",
        "generales": {},
        "telefonos": []
    }

    try:
        driver.get(detail_url)

        # Wait until the main title is present
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "h5.card-title div"))
        )

        # DEBUG: first 5000 chars
        print("📄 DETAILS PAGE SOURCE PREVIEW (first 5000 chars):")
        print(driver.page_source[:5000])

        # --- Name & Cedula ---
        name_parts = driver.find_elements(By.CSS_SELECTOR, "h5.card-title div")
        if len(name_parts) >= 2:
            data["name"] = name_parts[0].text.strip()
            data["cedula"] = name_parts[1].text.strip()

        # --- Image ---
        try:
            foto_div = driver.find_element(By.CSS_SELECTOR, ".foto")
            style = foto_div.get_attribute("style")  # e.g., background-image: url(...)
            url = style.split("url(")[-1].split(")")[0].strip('"').strip("'")
            if url:
                data["image"] = url
        except:
            pass

        # --- Generales ---
        try:
            generales = {}
            rows = driver.find_elements(By.CSS_SELECTOR, "#generales .row")
            for row in rows:
                try:
                    key = row.find_element(By.CSS_SELECTOR, ".title").text.strip()
                    value = row.find_element(By.CSS_SELECTOR, ".subtitle").text.strip()
                    generales[key] = value
                except:
                    continue
            data["generales"] = generales
        except Exception as e:
            print(f"⚠️ Error extracting generales: {e}")

        # -----------------------------
        # Extract telefonos table (handles collapsed accordion)
        # -----------------------------
        try:
            # Expand the telefonos accordion if it is collapsed
            try:
                tel_button = driver.find_element(By.CSS_SELECTOR, "button[data-bs-target='#telefonos']")
                if "collapsed" in tel_button.get_attribute("class"):
                    tel_button.click()
                    time.sleep(0.5)  # wait for the accordion to expand
            except Exception as e:
                print(f"⚠️ Could not expand Telefonos accordion: {e}")

            # Now scrape the telefonos rows
            telefonos = []
            phone_rows = driver.find_elements(By.CSS_SELECTOR, "#telefonos tr")
            for row in phone_rows:
                cols = row.find_elements(By.TAG_NAME, "td")
                if cols:
                    telefonos.append(cols[0].text.strip())
            data["telefonos"] = telefonos
        except Exception as e:
            print(f"⚠️ Error extracting telefonos: {e}")
            data["telefonos"] = []

    except Exception as main_err:
        print(f"❌ Error scraping details: {main_err}")

    finally:
        driver.quit()

    return data


# -----------------------------
# Flask Route
# -----------------------------
@details_bp.route("/details", methods=["POST"])
def details_route():
    """API endpoint to fetch details for a person."""
    try:
        data = request.json
        detail_url = data.get("url")
        if not detail_url:
            return jsonify({"error": "Missing 'url' in request"}), 400

        print(f"🔎 Fetching details from: {detail_url}")
        scraped = scrape_details(detail_url)
        print(f"✅ Parsed details: {scraped}")
        return jsonify(scraped)

    except Exception as e:
        print(f"❌ Error in /details route: {e}")
        return jsonify({"error": "Failed to scrape details"}), 500