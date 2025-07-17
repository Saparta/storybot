import requests
import base64
import json # Import json to pretty-print responses

# --- Your Reddit App Details (Make sure these are EXACTLY copied from Reddit) ---
CLIENT_ID = "Snzx8kCcA0HolwBRc_uZ1w" # <--- REPLACE THIS
CLIENT_SECRET = "dO4ldkWLKQA3E2RjFdymGiku13bnHg" # <--- REPLACE THIS
AUTHORIZATION_CODE = "l5uA7N242a0tbK3WGfFFiNM3RK0Cog#_" # <--- REPLACE THIS - GET A FRESH ONE EACH TIME YOU TEST
REDIRECT_URI = "http://localhost:8080" # <--- MAKE SURE THIS MATCHES YOUR REDDIT APP EXACTLY

# --- Define the Reddit token endpoint ---
TOKEN_URL = "https://www.reddit.com/api/v1/access_token"

# --- Prepare the Basic Authentication Header ---
client_auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
encoded_client_auth = base64.b64encode(client_auth_string.encode("utf-8")).decode("utf-8")

headers = {
    "User-Agent": "MyRedditTokenFetcher/1.0 by u/Humble-Independent22", # Double-check your Reddit username here
    "Authorization": f"Basic {encoded_client_auth}",
    "Content-Type": "application/x-www-form-urlencoded" # Explicitly setting this can sometimes help
}

# --- Prepare the POST request data (form-urlencoded) ---
data = {
    "grant_type": "authorization_code",
    "code": AUTHORIZATION_CODE,
    "redirect_uri": REDIRECT_URI
}

# --- DEBUGGING OUTPUT ---
print("--- DEBUGGING REQUEST DETAILS ---")
print(f"Client ID: {CLIENT_ID}")
print(f"Client Secret (Encoded): {encoded_client_auth}") # Be cautious about showing full secret
print(f"Authorization Code (First 10 chars): {AUTHORIZATION_CODE[:10]}...")
print(f"Redirect URI: {REDIRECT_URI}")
print(f"Token URL: {TOKEN_URL}")
print(f"Headers: {json.dumps(headers, indent=2)}")
print(f"Data Payload: {json.dumps(data, indent=2)}") # Use json.dumps for readability

# --- Make the POST request ---
print("\nAttempting to exchange authorization code for tokens...")
try:
    response = requests.post(TOKEN_URL, headers=headers, data=data)
    response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

    # --- Parse the JSON response ---
    token_info = response.json()

    access_token = token_info.get("access_token")
    refresh_token = token_info.get("refresh_token")
    expires_in = token_info.get("expires_in")
    scope = token_info.get("scope")

    if refresh_token:
        print("\n--- Success! Tokens Received ---")
        print(f"Access Token: {access_token}")
        print(f"Refresh Token: {refresh_token}")
        print(f"Access Token Expires in: {expires_in} seconds")
        print(f"Granted Scopes: {scope}")
        print("\nIMPORTANT: Store your refresh token securely!")
    else:
        print("\n--- Error ---")
        print("Refresh token not found in response. Possible reasons:")
        print("  - Did you set 'duration=permanent' in your initial authorization URL?")
        print("  - Did the user grant 'permanent' access?")
        print("  - Check your scopes.")
        print(f"Full response: {json.dumps(token_info, indent=2)}") # Pretty print the full response

except requests.exceptions.HTTPError as e:
    print(f"\n--- HTTP Error ---")
    print(f"An HTTP error occurred: {e}")
    if e.response is not None:
        print(f"Response status code: {e.response.status_code}")
        print(f"Response content: {e.response.text}") # THIS IS KEY - WHAT IS REDDIT'S ERROR MESSAGE?
except requests.exceptions.RequestException as e:
    print(f"\n--- Request Error ---")
    print(f"An error occurred during the request: {e}")
except Exception as e:
    print(f"\n--- General Error ---")
    print(f"An unexpected error occurred: {e}")