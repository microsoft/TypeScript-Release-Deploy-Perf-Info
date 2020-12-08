# Generate stats on perf in a per-commit basis automatically

This has two current approaches in mind:

- 1. Use a single GitHub Action workflow to measure perf. We're looking for relative perf, so maybe that one computer is enough.
- 2. Use a GitHub Action to start up a beefy azure VM instance which runs this instead.

We'll try the first, and if that's not good enough, we'll try te second.

To run locally, using Node 13+

```sh
git clone https://github.com/microsoft/TypeScript-Release-Deploy-Perf-Info
cd TypeScript-Release-Deploy-Perf-Info
yarn install
node run.mjs
```

The scripting is all done in NodeJS via [ShellJs](https://www.npmjs.com/package/shelljs) which allows for it to run in Windows and UNIX.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
