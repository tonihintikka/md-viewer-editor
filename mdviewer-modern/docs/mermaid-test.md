# Mermaid Test File

This file contains various Mermaid diagram formats to test rendering.

## Standard Mermaid Codeblock

```mermaid
flowchart TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

## Mermaid With Finnish Characters

```mermaid
flowchart TB
    A[Käyttäjä] --> B{Kirjautunut?}
    B -->|Kyllä| C[Näytä hallintapaneeli]
    B -->|Ei| D[Näytä kirjautumissivu]
    C --> E[Käyttäjän tiedot]
    D --> E
```

## Mermaid With Subgraph

```mermaid
flowchart TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Skip]
    
    subgraph Prosessi
    C --> E[Result]
    D --> E
    end
    
    E --> F[End]
```

## Mermaid With Finnish Subgraph

```mermaid
flowchart TB
    A[Start] --> B{Päätös}
    B -->|Kyllä| C[Toiminto]
    B -->|Ei| D[Ohita]
    
    subgraph Toimenpiteet
    C --> E[Tulos]
    D --> E
    end
    
    E --> F[Loppu]
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Käyttäjä
    participant Järjestelmä
    
    Käyttäjä->>Järjestelmä: Kirjaudu sisään
    Järjestelmä-->>Käyttäjä: Kirjautuminen onnistui
```

## No Language Tag (should be detected)

flowchart TB
    A[Auto-detect] --> B{Works?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug] 