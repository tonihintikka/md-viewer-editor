# Mermaid Diagrams in MDViewer

This page demonstrates the Mermaid diagram integration in the MDViewer application.

## Flowchart Example

```mermaid
flowchart LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Check your code]
    C --> E[Continue exploring]
    D --> B
```

## Sequence Diagram Example

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant MDViewer
    participant Mermaid

    User->>Browser: Open MDViewer
    Browser->>MDViewer: Load application
    MDViewer->>MDViewer: Initialize components
    
    User->>MDViewer: Load markdown with Mermaid syntax
    MDViewer->>Mermaid: Parse diagram definitions
    Mermaid->>MDViewer: Return rendered SVG
    MDViewer->>Browser: Display diagram
    Browser->>User: Show rendered content
```

## Class Diagram Example

```mermaid
classDiagram
    class MarkdownRenderer {
        +render(markdown: string)
    }
    class MermaidDiagram {
        -containerRef: Ref
        -uniqueId: string
        +render(definition: string)
    }
    class App {
        -state: AppState
        +loadFile(file: File)
        +saveFile()
    }
    
    App --> MarkdownRenderer : uses
    MarkdownRenderer --> MermaidDiagram : renders
```

## State Diagram Example

```mermaid
stateDiagram-v2
    [*] --> Editing
    Editing --> Previewing : Click Preview
    Previewing --> Editing : Click Edit
    Previewing --> Exporting : Click Export
    Exporting --> Previewing : Export Complete
    Editing --> [*] : Close App
    Previewing --> [*] : Close App
```

## Gantt Chart Example

```mermaid
gantt
    title MDViewer Development Plan
    dateFormat  YYYY-MM-DD
    
    section Planning
    Research          :done,    plan1, 2025-04-01, 7d
    Design UI         :done,    plan2, 2025-04-08, 5d
    
    section Development
    Core Features     :active,  dev1, 2025-04-15, 14d
    Mermaid Support   :         dev2, 2025-04-22, 7d
    
    section Testing
    Integration Tests :         test1, after dev2, 7d
    User Acceptance   :         test2, after test1, 5d
    
    section Release
    Documentation     :         docs1, after test2, 4d
    Release v1.0      :milestone, rel1, after docs1, 0d
```

## Pie Chart Example

```mermaid
pie
    title MDViewer Feature Usage
    "Markdown Editing" : 40
    "Mermaid Diagrams" : 25
    "GitHub Flavored Markdown" : 20
    "Dark Mode" : 15
```

## Git Graph Example

```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout main
    merge feature
    commit
```

---

All of these diagrams are rendered directly in the browser using Mermaid.js integration. You can create your own diagrams using the Mermaid syntax in code blocks with the `mermaid` language identifier. 