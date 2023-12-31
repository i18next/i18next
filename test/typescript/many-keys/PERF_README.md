# Performance

`parseKeys.perf.ts` file is used to test performance when there are a lot of keys.

## Run performance checks

To run performance check change your current working directory to this folder.

```bash
cd test/typescript/many-keys
```

Then run tsc

```bash
tsc time tsc --noEmit
```

Alternatively you can also debug using [ts trace](https://github.com/microsoft/typescript-analyze-trace)

```bash
tsc -p tsconfig.json --generateTrace traceDir && analyze-trace traceDir
```

Or you can debug using `chrome://tracing`. A guide can be found here:
https://github.com/microsoft/TypeScript/wiki/Performance#performance-tracing
