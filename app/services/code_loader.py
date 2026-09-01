from pathlib import Path


def load_code(file_path: Path):

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()

    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None