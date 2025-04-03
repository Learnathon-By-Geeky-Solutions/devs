Write-Host "Starting project reorganization..." -ForegroundColor Green

# Create necessary directories
$directories = @(
    "./src/api",
    "./src/assets",
    "./src/contexts",
    "./src/hooks",
    "./src/layouts",
    "./src/services",
    "./src/store",
    "./src/utils",
    "./docs",
    "./scripts",
    "./config"
)

foreach ($dir in $directories) {
    if (-Not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir"
    }
}

# Move configuration files to config directory
Write-Host "Moving configuration files..." -ForegroundColor Green
if (Test-Path ".env.local") {
    Copy-Item ".env.local" -Destination "./config/" -Force
    Write-Host "Copied .env.local to config directory"
}

# Remove duplicate if it exists
if (Test-Path "config/.env.local" -PathType Leaf) {
    if (Test-Path "config/.env.local" -PathType Container) {
        Remove-Item "config/.env.local" -Recurse -Force
    }
}

# Move documentation files to docs directory
Write-Host "Organizing documentation..." -ForegroundColor Green
if (Test-Path "resource") {
    Copy-Item "resource\*" -Destination ".\docs\" -Recurse -Force
    Write-Host "Copied resource contents to docs directory"
}

# Reorganize src structure
Write-Host "Organizing source code..." -ForegroundColor Green
if ((Test-Path "components") -and (-Not (Test-Path "src/components"))) {
    Move-Item "components" -Destination "src/" -Force
    Write-Host "Moved components to src directory"
}

# Create index files for each directory
Write-Host "Creating standard structure files..." -ForegroundColor Green
$srcDirs = Get-ChildItem -Path ".\src" -Directory
foreach ($dir in $srcDirs) {
    $indexPath = Join-Path $dir.FullName "index.ts"
    if (-Not (Test-Path $indexPath)) {
        "// Export all components from this directory" | Out-File -FilePath $indexPath -Encoding utf8
        Write-Host "Created index file in: $($dir.FullName)"
    }
}

# Create README file
$readmeContent = @"
# Project Structure

This project follows modern Next.js application structure.

## Directories
- `src/`: Application source code
- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: Reusable UI components
- `src/contexts/`: React context providers
- `src/hooks/`: Custom React hooks
- `src/services/`: API services and external integrations
- `src/store/`: State management
- `src/utils/`: Utility functions
- `src/types/`: TypeScript type definitions
- `public/`: Static assets
- `docs/`: Project documentation
- `config/`: Configuration files
- `scripts/`: Utility scripts
"@

$readmeContent | Out-File -FilePath ".\README.md" -Encoding utf8
Write-Host "Created README.md with project structure"

# Create .gitkeep files for empty directories
Write-Host "Creating .gitkeep files for empty directories..." -ForegroundColor Green
$emptyDirs = Get-ChildItem -Path "." -Directory -Recurse | Where-Object {
    ($_.GetFiles().Count -eq 0) -and
    ($_.GetDirectories().Count -eq 0) -and
    (-Not ($_.FullName -like "*\node_modules*")) -and
    (-Not ($_.FullName -like "*\.git*")) -and
    (-Not ($_.FullName -like "*\.next*"))
}

foreach ($dir in $emptyDirs) {
    $gitkeepPath = Join-Path $dir.FullName ".gitkeep"
    "" | Out-File -FilePath $gitkeepPath -Encoding utf8
    Write-Host "Created .gitkeep in: $($dir.FullName)"
}

# Create sample service file
$apiServiceContent = @"
/**
 * API Service
 * Handles all API requests for the application
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch wrapper with standard options
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export default {
  // Define your API methods here
  getExample: () => fetchAPI('/example'),
  // Add more API methods as needed
};
"@

$apiServiceContent | Out-File -FilePath ".\src\services\api.ts" -Encoding utf8
Write-Host "Created sample API service file"

# Create sample hooks file
$hookContent = @"
import { useState, useEffect } from 'react';

/**
 * Hook for using localStorage with React state
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get from local storage then parse stored json
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Set to localStorage
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
"@

$hookContent | Out-File -FilePath ".\src\hooks\useLocalStorage.ts" -Encoding utf8
Write-Host "Created sample hook file"

Write-Host "Project reorganization complete!" -ForegroundColor Green
Write-Host "Please check that all Next.js specific configuration is still properly located."
Write-Host "You may need to update import paths in your code."
