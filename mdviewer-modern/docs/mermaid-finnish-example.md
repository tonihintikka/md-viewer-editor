# Finnish Mermaid Diagram Example

This document provides a working example of a Mermaid diagram with Finnish text that should render correctly in MDViewer.

## Basic Flowchart with Finnish Text

```mermaid
flowchart TB
    A[Käyttäjän kysymys] --> B[AI analysoi kysymyksen]
    B --> C[AI hakee tietoa verkkoindeksistä]
    C --> D[AI arvioi lähteet ja priorisoi]
    D --> E[AI muodostaa vastauksen]
    E --> F[Vastaus käyttäjälle]
    
    subgraph "Priorisointikriteerit"
    I[Lähteen luotettavuus]
    J[Tiedon tuoreus]
    K[Relevanssi kysymykseen]
    L[Asiantuntijuustaso]
    end
    
    I --> D
    J --> D
    K --> D
    L --> D
```

## Sequence Diagram with Finnish Characters

```mermaid
sequenceDiagram
    participant Käyttäjä
    participant Järjestelmä
    participant Tietokanta
    
    Käyttäjä->>Järjestelmä: Kirjaudu sisään
    Järjestelmä->>Tietokanta: Tarkista käyttäjätiedot
    Tietokanta-->>Järjestelmä: Käyttäjätiedot vahvistettu
    Järjestelmä-->>Käyttäjä: Kirjautuminen onnistui
```

## Class Diagram with Finnish Terms

```mermaid
classDiagram
    class Käyttäjä {
        +String nimi
        +String sähköposti
        +kirjauduSisään()
        +kirjauduUlos()
    }
    
    class Järjestelmä {
        +Array käyttäjät
        +lisääKäyttäjä()
        +poistaKäyttäjä()
    }
    
    Käyttäjä --> Järjestelmä: käyttää
```

## Gantt Chart with Finnish Project Names

```mermaid
gantt
    title Projektin Aikataulu
    dateFormat  YYYY-MM-DD
    
    section Suunnittelu
    Vaatimusmäärittely    :a1, 2025-01-01, 10d
    Arkkitehtuuri         :a2, after a1, 5d
    
    section Toteutus
    Käyttöliittymä        :b1, after a2, 15d
    Tietokantaintegraatio :b2, after b1, 10d
    
    section Testaus
    Yksikkötestaus        :c1, after b2, 8d
    Järjestelmätestaus    :c2, after c1, 12d
```

## Tips for Creating Finnish Mermaid Diagrams

1. Always quote subgraph titles: `subgraph "Priorisointikriteerit"`
2. Keep node IDs simple (A, B, C) but feel free to use Finnish in the labels: `A[Käyttäjä]`
3. For edge labels with Finnish text, consider using quotes: `A -->|"Lähettää viestin"| B`
4. If you experience issues, try HTML entities as a fallback: `A[K&auml;ytt&auml;j&auml;]`

Refer to the [Creating Mermaid Diagrams with Finnish Text](mermaid-finnish.md) guide for more detailed information. 