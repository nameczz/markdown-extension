# markdown-fragment-variable-preview README

Github: https://github.com/nameczz/markdown-extension

## Dependencies

Base on md2md: https://github.com/zilliztech/md2md

## Demo

![Demo](./demo.gif)

## Folders

```js
-| site
  -| en
    -| fragment             // can includes variables or fragments
      -| child            // any name you want
        - child.md        // can be use in your markdown like {{fragments/child/child.md}}
        - anyname.md      // can be use in your markdown like {{fragments/anyname.md}}
    -| yourpage1
      - overview.md       // can include fragment:{{fragments/child/child.md}} or variable: {{var.name}}
      - variables.json    // local variables in yourpage1 , if key is same, will overwrite global variables
    - variables.json      // global variables
```

## Features

In this extension, we support variables and fragment in markdown file.

1. use variables

```js
// variabeFile (doc_from/en/variables.json)
{"name":"md2md"}

// origin docFile (doc_from/en/test.md):
---
name: test
---
### This is {{var.name}};
### Visit {{var.name}} for more details;

// turn to target(doc_to/en/test.md)
---
name: test
---
### This is md2md;
### Visit test for more details;
```

2. use fragment and variables;

```javascript
// origin(src/test.md):
### This is {{var.name}};
{{fragment/card.md}}
{{fragment/warn.md}}

// variableFile (src/variables.json)
{"name":"Tom", "info":{ "phone":"1234567", "email":"xxx@gmail.com"}}

// fragmentFile (src/fragment/card.json)
###### name:{{var.name}}
###### email:{{var.email}}

// fragmentFile (src/fragment/warn.json)
###### the info should keep confidential

// in the preview will be
### This is Tom ;
###### name:Tom
###### email:xxx@gmail.com
###### the info should keep confidential
```

3. use multilayer variables

```javascript
// origin(src/user/info.md):
### This is {{var.name}};
{{fragment/card.md}}
{{fragment/warn.md}}

// variableFile (src/variables.json)
{"name":"Tom", "info":{"phone":"1234567", "email":"xxx@gmail.com"}}

// variableFile (src/user/variables.json)
{"name":"Alex", "info":{"phone":"9876543"}}

// fragmentFile (src/fragment/card.json)
###### name:{{var.name}}
###### email:{{var.email}}

// fragmentFile (src/fragment/warn.json)
###### the info should keep confidential

// in the preview will be
### This is Alex;
###### name:Alex
###### email:xxx@gmail.com
###### the info should keep confidential
```

**Enjoy!**
