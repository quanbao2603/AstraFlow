import os
import json

ROOT = r"d:\Code\AstraFlow"
IGNORE_DIRS = {".git", "node_modules", ".next", "dist", "build", "generated"}
OUTPUT = r"C:\Users\Administrator\.gemini\antigravity\brain\928e8a61-997e-4b26-bb73-f78b4eb95a74\graph_nodes_payload.json"

payload = {
    "folders": [],
    "files": [],
    "dependencies": [],
    "relations": []
}

def traverse(curr_path, parent_id=None):
    relative = os.path.relpath(curr_path, ROOT)
    if relative == ".":
         curr_name = "root"
         curr_id = "root"
    else:
         curr_name = os.path.basename(curr_path)
         curr_id = relative.replace("\\", "/")

    payload["folders"].append({
         "id": curr_id,
         "name": curr_name,
         "path": relative
    })
    
    if parent_id:
         payload["relations"].append({
              "source": parent_id,
              "target": curr_id,
              "type": "CONTAINS"
         })

    try:
         for item in os.listdir(curr_path):
              if item in IGNORE_DIRS:
                   continue
              item_path = os.path.join(curr_path, item)
              item_id = os.path.relpath(item_path, ROOT).replace("\\", "/")
              if os.path.isdir(item_path):
                   traverse(item_path, curr_id)
              else:
                   payload["files"].append({
                        "id": item_id,
                        "name": item,
                        "path": os.path.relpath(item_path, ROOT).replace("\\", "/")
                   })
                   payload["relations"].append({
                        "source": curr_id,
                        "target": item_id.replace("\\", "/"),
                        "type": "CONTAINS"
                   })
    except Exception:
         pass

traverse(ROOT)

# Read package.json dependencies
def read_deps(package_json_path, app_node_id):
     if os.path.exists(package_json_path):
          try:
               with open(package_json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    deps = data.get("dependencies", {})
                    dev_deps = data.get("devDependencies", {})
                    for dep, ver in {**deps, **dev_deps}.items():
                         # Stringify version just in case
                         ver_str = str(ver)
                         dep_id = f"dep_{dep}_{app_node_id}"
                         payload["dependencies"].append({
                              "id": dep_id,
                              "name": dep,
                              "version": ver_str
                         })
                         payload["relations"].append({
                              "source": app_node_id,
                              "target": dep_id,
                              "type": "DEPENDS_ON"
                         })
          except Exception:
               pass

read_deps(os.path.join(ROOT, r"backend\package.json"), "backend")
read_deps(os.path.join(ROOT, r"frontend\package.json"), "frontend")

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)

print(f"Payload created successfully with {len(payload['folders'])} folders, {len(payload['files'])} files, and {len(payload['dependencies'])} dependencies.")
