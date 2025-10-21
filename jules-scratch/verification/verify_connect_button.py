from playwright.sync_api import sync_playwright, Page, expect

def verify_connect_button(page: Page):
    """
    This script verifies that clicking the "Connect" button displays a toast
    message with the authentication URL.
    """
    # 1. Arrange: Go to the application's home page.
    page.goto("http://localhost:3000/")

    # 2. Act: Click on the "Settings" button in the sidebar.
    settings_button = page.get_by_role("button", name="Settings")
    settings_button.click()

    # 3. Act: Click on the "Connect" button for Amazon.
    amazon_connect_button = page.get_by_role("button", name="Connect").first
    amazon_connect_button.click()

    # 4. Assert: Check that the toast message is visible.
    toast = page.get_by_text("Redirecting to:")
    expect(toast).to_be_visible()

    # 5. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot taken successfully.")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    verify_connect_button(page)
    browser.close()
