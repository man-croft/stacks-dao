import os
import re

def sanitize_filename(name):
    # Remove invalid characters and replace spaces with underscores
    s = re.sub(r'[^\w\s-]', '', name).strip().lower()
    return re.sub(r'[-\s]+', '_', s)

def shard_document(input_file, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    current_file = None
    file_counter = 0
    buffer = []

    for line in lines:
        if line.startswith('# '):
            # Write previous buffer to file if it exists
            if current_file and buffer:
                with open(current_file, 'w', encoding='utf-8') as f:
                    f.writelines(buffer)
                buffer = []

            # Start new section
            file_counter += 1
            title = line.strip()[2:]
            filename = f"{file_counter:03d}_{sanitize_filename(title)}.md"
            current_file = os.path.join(output_dir, filename)
            buffer.append(line)
        else:
            if current_file:
                buffer.append(line)
            # If content appears before the first header, you might want to handle it.
            # For now, we assume the file starts with a header or we ignore preamble.
            # Based on previous `view_file`, line 1 is "# Introduction", so we are good.

    # Write the last section
    if current_file and buffer:
        with open(current_file, 'w', encoding='utf-8') as f:
            f.writelines(buffer)

    print(f"Created {file_counter} shards in {output_dir}")

if __name__ == "__main__":
    shard_document('stacks-llm.txt', 'stacks-shards')
