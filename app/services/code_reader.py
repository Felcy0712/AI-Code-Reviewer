from pathlib import Path

def load_code(file_path: Path):

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

SUPPORTED_EXTENSIONS = {
    ".py",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".js",
    ".ts",
    ".java",
}

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
}


def read_source_files(project_path: Path):

    source_files = []

    for file in project_path.rglob("*"):

        if file.is_dir():
            continue

        if any(folder in file.parts for folder in IGNORE_DIRS):
            continue

        if file.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        source_files.append(file)

    return source_files