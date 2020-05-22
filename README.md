# markdown-fragment-variable-preview README

## Floders

```js
-fragment | // can includes variables or fragments
-child | // any name you want
-child.md | // can be use in your markdown like {{fragments/child/child.md}}
(-anyname.md - // can be use in your markdown like {{fragments/anyname.md}}
  yourpage1) |
-overview.md | // can include fragment:{{fragments/child/child.md}} or variable: {{var.name}}
  (-variables.json - // local variables in yourpage1 , if key is same, will overwrite global variables
    variables.json); // global variables
```

## Features

In this extension, we support variables and fragment in markdown file.

1. use variables

```js
// origin(src/test.md):
### This is {{var.name}};

// variableFile(src/variables.json)
{"name":"Tom"}

// in the preview will be
### This is Tom;
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
