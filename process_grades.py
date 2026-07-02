import sys
import subprocess
import hashlib
import json
import os

# Ensure pandas and openpyxl are installed
try:
    import pandas as pd
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "pandas", "openpyxl"])
    import pandas as pd

excel_path = "NotasMatematicaI1M6SIS2026.xlsx"
temp_excel_path = "temp_grades_read.xlsx"
output_path = "grades_data.js"

# Check which file to read (prefer temp file copied by orchestrator to avoid locks)
file_to_read = temp_excel_path if os.path.exists(temp_excel_path) else excel_path

if not os.path.exists(file_to_read):
    print(f"Error: Neither {excel_path} nor {temp_excel_path} was found.")
    sys.exit(1)

print(f"Reading grades data from: {file_to_read}...")
df = pd.read_excel(file_to_read)

# Helper to find column name by substring (strict match or fallback)
def find_col(sub, default_idx):
    for col in df.columns:
        if sub.lower() == str(col).lower().strip():
            return col
    for col in df.columns:
        col_str = str(col).lower()
        if sub.lower() in col_str:
            if sub.lower() == "final" and "finalizaci" in col_str:
                continue
            return col
    return df.columns[default_idx]

# Map columns
col_name = find_col("nombres y apellidos", 3)
col_email = find_col("dirección de correo electrónico", 4)
if col_email not in df.columns:
    col_email = find_col("correo", 4)
col_ac1 = find_col("acumulado 1", 6)
col_ex1 = find_col("examen 1", 7)
col_ac2 = find_col("acumulado 2", 8)
col_ex2 = find_col("examen 2", 9)
col_final = find_col("nota final", 10)

# Custom Cryptographic Stream Cipher to encrypt data client-side using email as key
def encrypt_record(plain_text, email):
    key = hashlib.sha256(email.encode("utf-8")).digest()
    plain_bytes = plain_text.encode("utf-8")
    keystream = b""
    counter = 0
    while len(keystream) < len(plain_bytes):
        keystream += hashlib.sha256(key + str(counter).encode("utf-8")).digest()
        counter += 1
    cipher_bytes = bytes(p ^ k for p, k in zip(plain_bytes, keystream))
    return cipher_bytes.hex()

grades_db = {}

for idx, row in df.iterrows():
    raw_email = row[col_email]
    if pd.isna(raw_email):
        continue
    
    email = str(raw_email).strip().lower()
    if not email:
        continue
    
    # Compute SHA-256 of the email for lookup
    email_hash = hashlib.sha256(email.encode("utf-8")).hexdigest()
    
    name = str(row[col_name]).strip()
    
    # Safely convert to float/int
    def clean_val(val):
        if pd.isna(val):
            return 0
        try:
            num = float(val)
            return int(num) if num.is_integer() else num
        except (ValueError, TypeError):
            return 0

    ac1 = clean_val(row[col_ac1])
    ex1 = clean_val(row[col_ex1])
    ac2 = clean_val(row[col_ac2])
    ex2 = clean_val(row[col_ex2])
    final_grade = clean_val(row[col_final])
    
    # Structure the plain text record
    record = {
        "name": name,
        "acumulado1": ac1,
        "examen1": ex1,
        "acumulado2": ac2,
        "examen2": ex2,
        "notaFinal": final_grade
    }
    
    # Encrypt the record using the student's email as the secret key
    plain_json = json.dumps(record, ensure_ascii=False)
    encrypted_hex = encrypt_record(plain_json, email)
    
    # Store the encrypted hex string in the database
    grades_db[email_hash] = encrypted_hex

# Write as js file
js_content = f"// This file was automatically generated and encrypted. Do not edit manually.\nwindow.GRADES_DB = {json.dumps(grades_db, indent=2, ensure_ascii=False)};\n"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Successfully processed and ENCRYPTED {len(grades_db)} students and wrote to {output_path}.")
