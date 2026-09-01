from pathlib import Path
import zipfile


UPLOAD_DIR = Path("data/uploads")


def extract_zip(zip_path: Path):

    extract_folder = UPLOAD_DIR / zip_path.stem

    extract_folder.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_folder)

    return extract_folder