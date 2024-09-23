#!/bin/bash

# ===========================================================
# Script: build_codebase.sh
# Description: Combines code files, generates file tree, and
#              consolidates outputs into codebase.txt directly
# ===========================================================

# ---------------------------
# Configuration Variables
# ---------------------------
OUTPUT_DIR="context_llm"
FINAL_CODEBASE_FILE="$OUTPUT_DIR/codebase.txt"

# File types to include
CODE_FILE_TYPES=("*.py" "*.js" "*.java" "*.cpp" "*.c" "*.h" "*.html" "*.css" "*.php" "*.rb" "*.go" "*.ts" "*.json" "*.yml" "*.sol" "*.local" "*.svg" "*.tsx" "*.mjs" "*.prisma" "*.sql" "*.env")

# Directories to include in file tree
INCLUDE_DIRS=("src" "public" "$OUTPUT_DIR" ".")

# Exclusion patterns (directories to exclude)
EXCLUDE_DIRS=(
  "./node_modules"
  "./.git"
  "./.cache"
  "./.config"
  "./.vscode"
  "./venv"
  "./.replit"
  "./replit.nix"
  "./dist"
  "./frontend/node_modules"
  "./frontend/.git"
  "./frontend/.cache"
  "./frontend/.config"
  "./frontend/.vscode"
  "./frontend/venv"
  "./frontend/.replit"
  "./frontend/replit.nix"
  "./backend/node_modules"
  "./backend/.git"
  "./backend/.cache"
  "./backend/.config"
  "./backend/.vscode"
  "./backend/venv"
  "./backend/.replit"
  "./backend/replit.nix"
)

# Additional exclusion patterns (specific files)
EXCLUDE_FILES=(
  "./*.lock"
  "./package-lock.json"
  "./frontend/*.lock"
  "./frontend/package-lock.json"
  "./backend/*.lock"
  "./backend/package-lock.json"
  "./.next/*"
  "./yarn.lock"
  "./frontend/.next/*"
  "./frontend/yarn.lock"
  "./backend/.next/*"
  "./backend/yarn.lock"
)

# ---------------------------
# Function Definitions
# ---------------------------

# Function to generate file tree and write directly to codebase.txt
generate_file_tree() {
  echo "Generating file tree and writing to $FINAL_CODEBASE_FILE..."
  
  # Initialize/Empty the final output file
  > "$FINAL_CODEBASE_FILE"

  # Write the File Tree section header
  echo "=== File Tree ===" >> "$FINAL_CODEBASE_FILE"
  echo "Project File Tree" >> "$FINAL_CODEBASE_FILE"

  # Initialize an array for exclusion arguments
  local exclude_args=()

  # Exclude directories
  for dir in "${EXCLUDE_DIRS[@]}"; do
    exclude_args+=("-path" "$dir" "-prune" "-o")
  done

  # Exclude specific files
  for file in "${EXCLUDE_FILES[@]}"; do
    exclude_args+=("-path" "$file" "-prune" "-o")
  done

  # Remove the trailing '-o' to prevent syntax errors
  if [ "${#exclude_args[@]}" -ge 1 ] && [ "${exclude_args[-1]}" == "-o" ]; then
    unset 'exclude_args[-1]'
  fi

  # Iterate through each include directory and append file paths to codebase.txt
  for dir in "${INCLUDE_DIRS[@]}"; do
    echo "$dir/" >> "$FINAL_CODEBASE_FILE"
    find "$dir" \( "${exclude_args[@]}" \) -o -type f -print | while read -r file; do
      echo "  $file" >> "$FINAL_CODEBASE_FILE"
    done
  done

  echo -e "\n\n" >> "$FINAL_CODEBASE_FILE"  # Add spacing before the Combined Code section
  echo "=== Combined Code ===" >> "$FINAL_CODEBASE_FILE"
  echo "" >> "$FINAL_CODEBASE_FILE"  # Add a newline for readability

  echo "File tree has been successfully written to $FINAL_CODEBASE_FILE."
}

# Function to combine code files and append directly to codebase.txt
combine_code_files() {
  echo "Combining code files and appending to $FINAL_CODEBASE_FILE..."

  # Initialize an array for exclusion arguments
  local exclude_args=()

  # Exclude directories
  for dir in "${EXCLUDE_DIRS[@]}"; do
    exclude_args+=("-path" "$dir" "-prune" "-o")
  done

  # Exclude specific files
  for file in "${EXCLUDE_FILES[@]}"; do
    exclude_args+=("-path" "$file" "-prune" "-o")
  done

  # Remove the trailing '-o' to prevent syntax errors
  if [ "${#exclude_args[@]}" -ge 1 ] && [ "${exclude_args[-1]}" == "-o" ]; then
    unset 'exclude_args[-1]'
  fi

  # Iterate through each file type and append relevant files
  for filetype in "${CODE_FILE_TYPES[@]}"; do
    # Use find with exclusion parameters
    # Correct find command structure:
    # find . \( -path "./node_modules" -prune -o -path "./.git" -prune \) -o -type f -name "*.py" -print
    find . \( "${exclude_args[@]}" \) -o -type f -name "$filetype" -print | while read -r file; do
      # Skip if the file is in an excluded directory or matches an excluded file pattern
      # This is redundant due to find exclusions, but added as a safety net
      if [[ $file == ./node_modules/* || $file == ./.git/* || $file == ./frontend/node_modules/* || $file == ./backend/node_modules/* ]]; then
        continue
      fi

      # Append file contents to the combined code section in codebase.txt
      echo "### Filename: $file" >> "$FINAL_CODEBASE_FILE"
      cat "$file" >> "$FINAL_CODEBASE_FILE"
      echo -e "\n\n" >> "$FINAL_CODEBASE_FILE"
    done
  done

  echo "All relevant code files have been successfully appended to $FINAL_CODEBASE_FILE."
}

# Function to handle errors
handle_error() {
  echo "Error on line $1"
  exit 1
}

# Trap errors and pass the line number to handle_error
trap 'handle_error $LINENO' ERR

# ---------------------------
# Main Execution Flow
# ---------------------------

generate_file_tree
combine_code_files

echo "Codebase has been successfully built and saved to $FINAL_CODEBASE_FILE."
