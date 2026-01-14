#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(__file__))

from parse_dataset import parse_receipts_from_dataset
from data_processor import calculate_monthly_summary
from receipt_ocr import process_uploaded_image

def main():
    # Only process uploaded receipts, not dataset
    receipts = []
    
    # Process uploaded receipts
    uploads_path = '../uploads'
    if os.path.exists(uploads_path):
        for file in os.listdir(uploads_path):
            if file.endswith(('.jpg', '.jpeg', '.png', '.bmp')) and not file.startswith('ocr_'):
                image_path = os.path.join(uploads_path, file)
                try:
                    receipt = process_uploaded_image(image_path, uploads_path)
                    if receipt:
                        receipts.append(receipt)
                except Exception as e:
                    print(f"Error processing uploaded image {file}: {e}")
    
    # If no uploaded receipts, show empty result
    if not receipts:
        print("No uploaded receipts found. Please upload receipt images first.")
        print("Monthly Summary:")
        print("No data available")
        return
    
    # Calculate and print monthly summary
    monthly_summary = calculate_monthly_summary(receipts)
    
    print("Monthly Summary:")
    for month, total in monthly_summary.items():
        print(f"{month}: ${total:.2f}")

if __name__ == "__main__":
    main()
