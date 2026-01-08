#!/usr/bin/env python3
"""
Test script to verify the admin password update endpoint
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_password_update():
    """Test the password update functionality"""
    
    # Step 1: Login as admin
    print("Step 1: Logging in as admin...")
    login_response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "admin1", "password": "Ha$h3d01"},
        headers={"Content-Type": "application/json"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.json())
        return
    
    print("✅ Login successful")
    cookies = login_response.cookies
    
    # Step 2: Test password update with wrong current password
    print("\nStep 2: Testing with wrong current password...")
    wrong_password_response = requests.post(
        f"{BASE_URL}/api/admin/update-password",
        json={
            "currentPassword": "wrongpassword",
            "newPassword": "newpassword123"
        },
        cookies=cookies,
        headers={"Content-Type": "application/json"}
    )
    
    if wrong_password_response.status_code == 401:
        print("✅ Correctly rejected wrong current password")
        print(f"   Response: {wrong_password_response.json()}")
    else:
        print(f"❌ Expected 401, got {wrong_password_response.status_code}")
    
    # Step 3: Test password update with correct current password
    print("\nStep 3: Testing with correct current password...")
    correct_password_response = requests.post(
        f"{BASE_URL}/api/admin/update-password",
        json={
            "currentPassword": "Ha$h3d01",
            "newPassword": "newpassword123"
        },
        cookies=cookies,
        headers={"Content-Type": "application/json"}
    )
    
    if correct_password_response.status_code == 200:
        print("✅ Password update successful")
        print(f"   Response: {correct_password_response.json()}")
    else:
        print(f"❌ Password update failed: {correct_password_response.status_code}")
        print(correct_password_response.json())
        return
    
    # Step 4: Try logging in with old password (should fail)
    print("\nStep 4: Testing login with old password (should fail)...")
    old_password_login = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "admin1", "password": "Ha$h3d01"},
        headers={"Content-Type": "application/json"}
    )
    
    if old_password_login.status_code == 401:
        print("✅ Old password correctly rejected")
    else:
        print(f"❌ Old password still works! Status: {old_password_login.status_code}")
    
    # Step 5: Try logging in with new password (should succeed)
    print("\nStep 5: Testing login with new password (should succeed)...")
    new_password_login = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": "admin1", "password": "newpassword123"},
        headers={"Content-Type": "application/json"}
    )
    
    if new_password_login.status_code == 200:
        print("✅ New password works!")
        new_cookies = new_password_login.cookies
        
        # Step 6: Change password back to original
        print("\nStep 6: Changing password back to original...")
        restore_response = requests.post(
            f"{BASE_URL}/api/admin/update-password",
            json={
                "currentPassword": "newpassword123",
                "newPassword": "Ha$h3d01"
            },
            cookies=new_cookies,
            headers={"Content-Type": "application/json"}
        )
        
        if restore_response.status_code == 200:
            print("✅ Password restored to original")
        else:
            print(f"⚠️  Failed to restore password: {restore_response.status_code}")
    else:
        print(f"❌ New password doesn't work! Status: {new_password_login.status_code}")
    
    print("\n" + "="*50)
    print("✅ All tests completed successfully!")
    print("="*50)

if __name__ == "__main__":
    test_password_update()
