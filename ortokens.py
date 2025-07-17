#!/usr/bin/env python

"""This example demonstrates how to use a pre-obtained authorization code
to retrieve a refresh token using PRAW.

This is useful if you've already manually performed the authorization step
in a browser and have the 'code' parameter from the redirect URL.

To create a Reddit application visit: https://www.reddit.com/prefs/apps/
Create a "web app" with the redirect uri set to: http://localhost:8080

You will need:
- REDDIT_CLIENT_ID (from your Reddit App settings)
- REDDIT_CLIENT_SECRET (from your Reddit App settings)
- AUTHORIZATION_CODE (the 'code' you got from the browser redirect)
- REDIRECT_URI (must be exactly 'http://localhost:8080' if that's what you used)

Usage:

    1. Set the environment variables:
       EXPORT praw_client_id=<YOUR_REDDIT_CLIENT_ID>
       EXPORT praw_client_secret=<YOUR_REDDIT_CLIENT_SECRET>

    2. Run the script and input your authorization code when prompted:
       python3 your_modified_script_name.py



curl -X POST \
      https://www.reddit.com/api/v1/access_token \
      -H 'Content-Type: application/x-www-form-urlencoded' \
      -d 'grant_type=authorization_code' \
      -d 'code=VJBhvTqW_pScrmQ9-qr00faVw8cptA#_' \
      -d 'redirect_uri=http://localhost:8080' \
      --user 'Snzx8kCcA0HolwBRc_uZ1w:dO4ldkWLKQA3E2RjFdymGiku13bnHg'

curl -X POST https://www.reddit.com/api/v1/access_token \
  -u "Snzx8kCcA0HolwBRc_uZ1w:dO4ldkWLKQA3E2RjFdymGiku13bnHg" \
  -d "grant_type=authorization_code&code=VJBhvTqW_pScrmQ9-qr00faVw8cptA&redirect_uri=http://localhost:8080" \
  -A "Web stories by Humble-Independent22"
"""
import os # Import os to read environment variables
import praw # Make sure PRAW is installed (pip install praw)
import sys 

CLIENT_ID = "Snzx8kCcA0HolwBRc_uZ1w" # <--- REPLACE THIS
CLIENT_SECRET = "dO4ldkWLKQA3E2RjFdymGiku13bnHg" # <--- REPLACE THIS
AUTHORIZATION_CODE = "JMqRiKJOKzIYHAfuqU9RKHIC-FhLHg" # <--- REPLACE THIS - GET A FRESH ONE EACH TIME YOU TEST
REDIRECT_URI = "http://localhost:8080" # <--- MAKE SURE THIS MATCHES YOUR REDDIT APP EXACTLY

def main():
    """Provide the program's entry point when directly executed."""

    # --- 1. Use constants for client ID and secret ---
    client_id = CLIENT_ID
    client_secret = CLIENT_SECRET

    if not client_id or not client_secret:
        print("Error: CLIENT_ID and CLIENT_SECRET constants must be set.")
        return 1

    # --- 2. Use constant for redirect URI ---
    redirect_uri = REDIRECT_URI

    # --- 3. Initialize PRAW with your credentials ---
    reddit = praw.Reddit(
        redirect_uri=redirect_uri,
        user_agent="MyTokenFetcher/1.0 by u/Humble-Independent22",
        client_id=client_id,
        client_secret=client_secret
    )

    # --- 4. Use constant for the authorization code ---
    authorization_code = AUTHORIZATION_CODE.strip()

    if not authorization_code:
        print("Error: AUTHORIZATION_CODE constant cannot be empty.")
        return 1

    print("\nAttempting to exchange authorization code for refresh token...")

    try:
        # --- 5. Directly authorize using the obtained code ---
        refresh_token = reddit.auth.authorize(authorization_code)

        print("\n--- Success! ---")
        print(f"Refresh Token: {refresh_token}")
        print("\nIMPORTANT: Store this refresh token securely! You can use it to get new access tokens.")

        return 0

    except Exception as e:
        print("\n--- Error ---")
        print(f"Failed to obtain refresh token: {e}")
        print("Common reasons for failure:")
        print("  - Authorization code was already used.")
        print("  - Authorization code has expired (they are short-lived).")
        print("  - Incorrect REDIRECT_URI in your Reddit App settings or in this script.")
        print("  - Incorrect CLIENT_ID or CLIENT_SECRET.")
        print("  - 'duration=permanent' was not specified when you generated the initial URL.")
        return 1

# --- Removed functions no longer needed since we're skipping the local server part ---
# def receive_connection(): ...
# def send_message(): ...

if __name__ == "__main__":
    sys.exit(main())