import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 720})

        print("Navigating to http://localhost:5173/")
        await page.goto("http://localhost:5173/")

        print("Waiting for canvas to load...")
        await page.wait_for_selector("canvas", timeout=10000)

        # Wait a moment for rendering and three.js scene to populate
        await page.wait_for_timeout(2000)

        print("Taking screenshot...")
        await page.screenshot(path="virtual_office_ui_screenshot.png")

        await browser.close()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(main())
