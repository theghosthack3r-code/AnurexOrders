from playwright.sync_api import sync_playwright, Page, expect

def verify_settings(page: Page):
    """
    This script verifies that the settings page loads correctly and that
    the email and phone number fields are present.
    """
    # 1. Arrange: Go to the application's home page.
    page.goto("http://localhost:3000/")
    page.wait_for_load_state("networkidle")

    # 2. Act: Click on the "Settings" button in the sidebar.
    settings_button = page.get_by_role("button", name="Settings")
    settings_button.click()

    # 3. Assert: Check that the main heading is visible.
    heading = page.get_by_role("heading", name="Store Connections")
    expect(heading).to_be_visible()

    # 4. Assert: Check that the email and phone number fields are present.
    email_input = page.get_by_label("Email Address")
    expect(email_input).to_be_visible()
    expect(email_input).to_have_value("your-business-email@example.com")

    phone_input = page.get_by_label("Phone Number")
    expect(phone_input).to_be_visible()
    expect(phone_input).to_have_value("+15551234567")

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot taken successfully.")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    verify_settings(page)
    browser.close()
