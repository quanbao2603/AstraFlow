import json
import os

INPUT = r"C:\Users\Administrator\.gemini\antigravity\brain\928e8a61-997e-4b26-bb73-f78b4eb95a74\graph_nodes_payload.json"
OUTPUT_DIR = r"C:\Users\Administrator\.gemini\antigravity\brain\928e8a61-997e-4b26-bb73-f78b4eb95a74\chunks"

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(INPUT, "r", encoding="utf-8") as f:
    data = json.load(f)

def save_chunk(items, name_prefix, size=500):
    for i in range(0, len(items), size):
        chunk = items[i:i+size]
        out_path = os.path.join(OUTPUT_DIR, f"{name_prefix}_{i//size}.json")
        with open(out_path, "w", encoding="utf-8") as out:
            json.dump(chunk, out, indent=2)
    print(f"Saved {len(items)} items for {name_prefix} in {((len(items)-1)//size)+1} chunks.")

save_chunk(data["folders"], "folders", chunk_size := 1000)
save_chunk(data["files"], "files", 1000)
save_chunk(data["dependencies"], "dependencies", 1000)
save_chunk(data["relations"], "relations", 1000)
