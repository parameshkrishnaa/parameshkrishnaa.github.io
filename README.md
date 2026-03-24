# Personal Academic Portfolio Website

This project is a **dynamic personal portfolio website** built using **HTML, CSS, Vanilla JavaScript, and JSON**.

The website displays:

* Personal information
* Research projects
* Publications
* Teaching activities
* Student supervision
* Lectures and talks
* News and announcements

All website content is stored in **JSON files**, and the frontend dynamically loads the data using JavaScript (`fetch()`).

This design allows **easy updates without modifying HTML files**.

---

# Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* JSON (for structured data storage)

No external frameworks or libraries are used.

---

# Project Folder Structure

```
portfolio-website/
│
├── index.html
├── about.html
├── projects.html
├── lab.html
├── lectures.html
├── teaching.html
├── students.html
├── news.html
│
├── style.css
│
├── script.js
│
├── data/
│   ├── home.json
│   ├── about.json
│   ├── projects.json
│   ├── lab.json
│   ├── lectures.json
│   ├── students.json
│   ├── teaching.json
│   └── news.json
│
├── images/
│   ├── paper1.jpg
│   └── students/
│       └── student1.jpg
│
├── pdfs/
│   └── sample.pdf
│
├── videos/
│   └── samplevid.mp4
│
└── README.md
```

---

# File and Folder Description

## HTML Files

Each HTML file corresponds to a separate webpage.

| File            | Description                               |
| --------------- | ----------------------------------------- |
| `index.html`    | Homepage with introduction and highlights |
| `about.html`    | Information about the person              |
| `projects.html` | Research projects                         |
| `lab.html`      | Lab activities and publications           |
| `lectures.html` | Talks and invited lectures                |
| `teaching.html` | Courses taught                            |
| `students.html` | Current students and alumni               |
| `news.html`     | News, awards, and announcements           |

---

## CSS File

`style.css`

Contains the styling for:

* Layout
* Typography
* Colors
* Responsive design

---

## JavaScript File

`script.js`

Handles:

* Fetching JSON data
* Rendering content dynamically
* Updating page elements
* Managing interactive functionality

Example:

```javascript
fetch('data/home.json')
```

---

# Data Folder

The **data folder contains all website content in JSON format**.

| File            | Purpose                     |
| --------------- | --------------------------- |
| `home.json`     | Homepage content            |
| `about.json`    | About page data             |
| `projects.json` | Research projects           |
| `lab.json`      | Publications and others     |
| `lectures.json` | Invited talks and lectures  |
| `students.json` | Current students and alumni |
| `teaching.json` | Courses taught              |
| `news.json`     | Announcements and awards    |

The website dynamically loads these files using JavaScript.

---

# JSON File Structure and Sample Entries

Below are **sample JSON entries** and **required fields**.

---

# students.json

Used to display **current students and alumni**.

## Required Fields

Current students:

* `name`
* `photo`
* `degree`
* `year`
* `period`
* `status`

Optional fields:

* `topic`
* `placement`
* `papers`
* `socials`

## Example

```json
{
  "current_students": [
    {
      "name": "Jae-Won Kim",
      "photo": "images/students/student1.jpg",
      "degree": "Ph.D.",
      "year": 2020,
      "period": "(2020 – Present)",
      "status": "current",
      "topic": "Federated Learning & Distributed Optimisation",
      "papers": [
        {
          "title": "FedOpt: Adaptive Optimisation for Federated Learning",
          "venue": "NeurIPS 2023",
          "links": [
            { "label": "PDF", "url": "https://example.com/fedopt.pdf" },
            { "label": "Code", "url": "https://github.com/example" }
          ]
        }
      ],
      "socials": [{"label":"Scholar","url":"https://scholar.google.com"}]
    }
  ],

  "alumni": [
    {
      "name": "Lucas Fernandez",
      "photo": "images/students/student1.jpg",
      "degree": "Ph.D.",
      "year": 2023,
      "period": "(2018 – 2023)",
      "status": "alumni",
      "placement": "Research Scientist, Google DeepMind",
      "papers": [
        {
          "title": "Scalable Bayesian Optimisation",
          "venue": "NeurIPS 2022",
          "links": [
            { "label": "PDF", "url": "https://example.com/sample.pdf" }
          ]
        }
      ],
      "socials": [{"label":"Scholar","url":"https://scholar.google.com"}]
    }
  ]
}
```

---

# teaching.json

Displays **courses taught by the instructor**.

## Required Fields

* `year_range`
* `season`
* `institute`
* `subjects`
* `level`

Optional:

* `notes`

## Example

```json
{
  "teaching": [
    {
      "year_range": "2023 – Present",
      "season": "Fall",
      "institute": "Northfield University",
      "subjects": ["Machine Learning"],
      "level": "Graduate",
      "notes": "Core graduate course covering statistical learning theory, PAC learning, and online learning."
    }
  ]
}
```

---

# lectures.json

Used for **talks, invited lectures, and presentations**.

## Required Fields

* `title`
* `institution`
* `year`
* `type`

Optional:

* `description`
* `downloads`

## Example

```json
{
  "lectures": [
    {
      "title": "Causal Representation Learning",
      "institution": "NeurIPS 2024 Workshop ",
      "year": 2024,
      "type": "Invited Talk",
      "description": "Overview of recent advances in learning structured representations.",
      "downloads": [
        { "label": "Slides (PDF)", "url": "pdfs/sample.pdf" }
      ]
    }
  ]
}
```

---

# projects.json

Used to display **research projects and funding information**.

## Required Fields

* `year`
* `name`
* `period`
* `description`

Optional:

* `funding`
* `links`

## Example

```json
{
  "projects": [
    {
      "year": 2023,
      "name": "DARPA GARD",
      "period": "(2023 – 2026)",
      "description": "Part of the DARPA Guaranteeing AI Robustness Against Deception programme.",
      "funding": "DARPA GARD · $820,000",
      "links": [
        { "label": "Project Page", "url": "pdfs/sample.pdf" }
      ]
    }
  ]
}
```

---

# lab.json

Used for **research publications**.

## Required Fields

* `id`
* `year`
* `title`
* `venue`

Optional:

* `description`
* `image`
* `abstract`
* `bibtex`
* `downloads`
* `typpe=Conference|Workshop|Books|Journals(default=conference if not mentioned)`

## Example

```json
{
  "publications": [
    {
      "id": "unique id",
      "year": 2025,
      "title": "title of publication/poster/article",
      "venue": "ICML 2025",
      "image": "g1.jpg",
      "description": "short description (optional)",
      "abstract": "abstract should be written here",
      "bibtex": "@inproceedings{unique id,\n  author    = {author names},\n  title     = {name of the title},\n  booktitle = {title of book/venue},\n  year      = {2025},\n  month     = {July},\n address =   {India}\n}",
      "downloads": [
        { "label": "PDF", "url": "pdfs/sample.pdf" }
      ]
    }
  ]
}
```

---

# news.json

Displays **news and announcements**.

## Required Fields

* `date`
* `year`
* `title`

Optional:

* `category`
* `description`

## Example

```json
{
  "news": [
    {
      "date": "March 2025",
      "year": 2025,
      "category": "Grant",
      "title": "Awarded NSF CAREER Grant",
      "description": "Received NSF CAREER Award for research in Trustworthy AI."
    }
  ]
}
```

---

# Images Folder

Stores all images used in the website.

```
images/
```

Structure:

```
images/
   paper1.jpg
   students/
       student1.jpg
```

---

# PDFs Folder

Stores research papers, slides, and documents.

```
pdfs/
```

Example:

```
sample.pdf
```

---

# Videos Folder

Stores video lectures or presentations.

```
videos/
```

Example:

```
samplevid.mp4
```

---

# How to Set Up and Run the Project

## 1 Clone or Download the Repository

```
git clone https://github.com/yourusername/portfolio-website.git
```

---

## 2 Navigate to the Project Folder

```
portfolio-website/
```

---

## 3 Run Using a Local Server

Since the website loads JSON using `fetch()`, it must run on a **local server**.

### Using VS Code Live Server

1 Install Live Server extension
2 Right-click `index.html`
3 Click **Open with Live Server**

---

### Using Python

```
python -m http.server
```

Open in browser:

```
http://localhost:8000
```

---

# Deployment

The website can be deployed using **GitHub Pages**.

Steps:

1 Upload repository to GitHub
2 Open repository settings
3 Enable **GitHub Pages**
4 Select branch `main`

Your site will be available at

```
https://username.github.io/portfolio-website/
```

---

# Features

* Multi-page academic portfolio
* Dynamic content loading
* JSON-based content management
* Organized structure
* Easy updates
* No backend required

---

# Author

Portfolio Website
Developed using **HTML, CSS, JavaScript, and JSON**

