import json
import os

base_path = r"d:\Code\AstraFlow\_agents\skills"
artifact_output_path = r"C:\Users\Administrator\.gemini\antigravity\brain\928e8a61-997e-4b26-bb73-f78b4eb95a74\all_skills_inventory.md"

def safe_load_json(file_path):
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            return {"error": str(e)}
    return None

report = "# 🌐 Master Skills Index\n\n"
report += "Below is the consolidated list of all indexed or available skills in your environment, grouped by their containing subdirectories.\n\n"

# 1. antigravity-skills (already covered mostly in prior steps, but include full list representation)
antigravity_index = safe_load_json(os.path.join(base_path, "antigravity-skills", "skills_index.json"))

if antigravity_index:
    report += "## 📂 1. `antigravity-skills` (%d skills)\n" % len(antigravity_index)
    for s in antigravity_index[:15]: # Show first 15 for brevity
         report += f"- **{s.get('name')}**: {s.get('description', '')}\n"
    report += f"... (total {len(antigravity_index)} skills)\n\n"

# 2. antigravity-awesome-skills
awesome_index = safe_load_json(os.path.join(base_path, "antigravity-awesome-skills", "skills_index.json"))

if awesome_index:
    report += "## 📂 2. `antigravity-awesome-skills` (%d skills)\n" % len(awesome_index)
    # Get top 15 skills to show in report
    for s in awesome_index[:15]:
        report += f"- **{s.get('name')}**: {s.get('description', '')}\n"
    report += f"... (total {len(awesome_index)} skills)\n\n"

# 3. rmyndharis-skills
rmynd_catalog = safe_load_json(os.path.join(base_path, "rmyndharis-skills", "catalog.json"))

if rmynd_catalog:
    # rmyndharis catalog structure might be different, let's look at its keys
    skills_list = rmynd_catalog.get("skills", [])
    if isinstance(rmynd_catalog, list):
         skills_list = rmynd_catalog
    elif "bundles" in rmynd_catalog:
         skills_list = rmynd_catalog.get("bundles", [])
    
    report += "## 📂 3. `rmyndharis-skills` (%d skills)\n" % len(skills_list)
    for s in skills_list[:15]:
         if isinstance(s, dict):
             report += f"- **{s.get('name')}**: {s.get('description', '')}\n"
         else:
             report += f"- {s}\n"
    report += f"... (total {len(skills_list)} skills)\n\n"

# 4. superpowers
super_path = os.path.join(base_path, "superpowers", "skills")
super_skills = []
if os.path.exists(super_path):
    super_skills = [d for d in os.listdir(super_path) if os.path.isdir(os.path.join(super_path, d))]

report += "## 📂 4. `superpowers` (%d folders list)\n" % len(super_skills)
for s in super_skills[:20]:
    report += f"- {s}\n"
report += "\n---\n"

with open(artifact_output_path, "w", encoding="utf-8") as f:
    f.write(report)

print("Master Index report written safely to brain.")
