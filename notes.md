### Nx vscode plugin

https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console

### Generating a plugin workspace

https://nx.dev/packages/nx-plugin#generating-a-plugin

```bash
$ npx create-nx-plugin my-org --pluginName my-plugin
```

npx create-nx-plugin moo-org --pluginName my-plugin

### Generating a general workspace

https://nx.dev/nx/create-nx-workspace
https://nx.dev/recipes/getting-started/set-up-a-new-workspace

```bash
# pass @latest in case npx cached an older version of create-nx-workspace
$ npx create-nx-workspace@latest
```

> Integrated
> apps
> sample-workspace
> yes

### Linking plugin to your general workspace

```json
"devDependencies": {
    // ...
    "@moo-org/my-plugin": "file:../moo-org/dist/packages/my-plugin"
},
```

### Editing JSON files

https://nx.dev/recipes/generators/modifying-files#modify-json-files