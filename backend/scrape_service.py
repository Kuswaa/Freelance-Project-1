# scrape_service.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def scrape_data(query_type, query_value):
    """
    Main scraping logic. Logs in, navigates to BÚSQUEDA SIMPLE, performs query,
    and returns results as JSON.
    """

    # Configure Chrome
    options = Options()
    options.add_argument("--headless=new")  # new headless mode (more stable)
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)

    try:
        print("🔹 Opening login page...")
        driver.get("https://api.contek.com.do/web/index.php")

        # --- Login ---
        try:
            print("🔹 Logging in...")
            driver.find_element(By.NAME, "user").send_keys("nellk")
            driver.find_element(By.NAME, "pass").send_keys("p0cho")
            driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
            print("✅ Login form submitted")
        except Exception as e:
            print("❌ Could not log in:", e)
            return {"results": [], "error": "login_failed"}

        # --- Wait for main menu ---
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.LINK_TEXT, "BÚSQUEDA SIMPLE"))
            )
            print("✅ Logged in, found 'BÚSQUEDA SIMPLE'")
        except Exception:
            print("⚠️ 'BÚSQUEDA SIMPLE' not found, waiting extra 5s...")
            time.sleep(5)

        # --- Go to simple search ---
        try:
            driver.find_element(By.LINK_TEXT, "BÚSQUEDA SIMPLE").click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.NAME, "param"))
            )
            print("✅ Reached search page")
        except Exception as e:
            print("❌ Could not reach search page:", e)
            return {"results": [], "error": "search_page_failed"}

        # --- Perform search ---
        try:
            search_box = driver.find_element(By.NAME, "param")
            search_box.clear()
            search_box.send_keys(query_value)
            search_box.send_keys(Keys.RETURN)
            print(f"🔍 Searching for {query_value}...")
        except Exception as e:
            print("❌ Search input not found:", e)
            return {"results": [], "error": "search_input_failed"}

        # wait for results to appear
        time.sleep(5)

        # --- Debug: print partial page source ---
        page_html = driver.page_source
        print("📄 PAGE SOURCE PREVIEW (first 1000 chars):")
        print(page_html[:1000])
        print("... [truncated] ...")

        # --- Try to extract results ---
        results = []
        items = driver.find_elements(By.CSS_SELECTOR, "#results .d-flex.item")
        print(f"🔎 Found {len(items)} result items")

        for idx, item in enumerate(items):
            try:
                print(f"--- Result item {idx+1} innerHTML ---")
                print(item.get_attribute("innerHTML")[:300])  # preview

                # Extract image
                image = ""
                try:
                    preimage_div = item.find_element(By.CSS_SELECTOR, "div.preimage")
                    style = preimage_div.get_attribute("style")
                    if style and "url(" in style:
                        image = style.split("url(")[1].split(")")[0].strip("'\"")
                except Exception:
                    pass

                # Fallback if no image
                if not image:
                    image = "/assets/no_user.png"

                # Extract name + cedula
                links = item.find_elements(By.TAG_NAME, "a")
                name = links[0].text.strip() if len(links) > 0 else "N/A"
                cedula = links[1].text.strip() if len(links) > 1 else "N/A"
                href = links[0].get_attribute("href") if len(links) > 0 else ""

                # Build absolute link
                if href.startswith("http"):
                    link = href
                else:
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

        print(f"✅ Returning {len(results)} results")
        return {
            "query_type": query_type,
            "query_value": query_value,
            "results": results
        }

    except Exception as e:
        print("❌ Error in scrape_data:", e)
        return {
            "query_type": query_type,
            "query_value": query_value,
            "results": [],
            "error": str(e)
        }

    finally:
        driver.quit()
