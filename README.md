# Religious Texts Repository

A comprehensive collection of religious texts served via GitHub Pages.

## Structure

```
static-content/
├── index.json
├── islamic/
│   ├── quran/
│   │   ├── metadata.json
│   │   └── chapters/
│   │       ├── 1.json
│   │       ├── 2.json
│   │       └── ...
│   └── hadith/
│       ├── metadata.json
│       └── collections/
├── christian/
│   └── bible/
│       ├── metadata.json
│       └── books/
└── judaic/
    └── torah/
        ├── metadata.json
        └── books/
```

## API Usage

### Get Index
```http
GET https://hamzarulez.github.io/religious-texts-app/index.json
```

### Get Text Metadata
```http
GET https://hamzarulez.github.io/religious-texts-app/[religion]/[text]/metadata.json
```

### Get Chapter/Book Content
```http
GET https://hamzarulez.github.io/religious-texts-app/[religion]/[text]/chapters/[id].json
```
