#!/bin/bash

# Initialize arrays for files and folders
declare -a files=()
declare -a folders=()

# Function to traverse directories
traverse() {
    local dir="$1"
    echo "Traversing $dir" # Debugging line
    for item in "$dir"/*; do
        if [ -d "$item" ]; then
            # Directory found
            folders+=("$item")
            traverse "$item"
        elif [ -f "$item" ]; then
            # File found
            files+=("$item")
        fi
    done
}

# Traverse the current directory
current_dir=$(pwd)
echo "Current directory: $current_dir" # Debugging line
traverse "$current_dir"

# Prepare JSON structures for files and folders
json_files=$(printf ', "%s"' "${files[@]}")
json_folders=$(printf ', "%s"' "${folders[@]}")

# Remove leading commas for proper JSON formatting
json_files=${json_files:2}
json_folders=${json_folders:2}

# Correctly strip the base path from each item
base_path="/home/lucas/Documents/Git/Appye/"
echo "Base path: $base_path" # Debugging line
stripped_files=("${files[@]/#${base_path}/}")
stripped_folders=("${folders[@]/#${base_path}/}")

# Convert stripped arrays to comma-separated strings
stripped_files_string=$(printf ', "%s"' "${stripped_files[@]}")
stripped_folders_string=$(printf ', "%s"' "${stripped_folders[@]}")

# Remove leading commas for proper JSON formatting
stripped_files_string=${stripped_files_string:2}
stripped_folders_string=${stripped_folders_string:2}

# Create JSON for files
echo "{\"files\": [$stripped_files_string]}" > files.json

# Create JSON for folders
echo "{\"folders\": [$stripped_folders_string]}" > folders.json

echo "Files and folders listed in files.json and folders.json"way