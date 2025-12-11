import os
import shutil

def filter_essentials(source_dir, dest_dir):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    # Define the ranges of file IDs to include (inclusive)
    # Core Concepts: 028-031
    # Developer Guide: 071-110
    # SDK & Integration: 114-133
    # Tutorials: 417-427
    ranges = [
        (28, 31),
        (71, 110),
        (114, 133),
        (417, 427)
    ]

    files = sorted(os.listdir(source_dir))
    count = 0

    for filename in files:
        if not filename.endswith('.md'):
            continue
        
        try:
            # Extract the ID from the filename (e.g., "001_introduction.md" -> 1)
            file_id = int(filename.split('_')[0])
        except ValueError:
            continue

        include = False
        for start, end in ranges:
            if start <= file_id <= end:
                include = True
                break
        
        if include:
            src_path = os.path.join(source_dir, filename)
            dest_path = os.path.join(dest_dir, filename)
            shutil.copy2(src_path, dest_path)
            count += 1
            print(f"Copied: {filename}")

    print(f"Successfully copied {count} essential files to {dest_dir}")

if __name__ == "__main__":
    filter_essentials('stacks-shards', 'stacks_essentials')
