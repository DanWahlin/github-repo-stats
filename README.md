# Example of Using the GitHub API to Get a Repository's Clone, Fork, and View Count

1. `npm install`
1. Run `node getStats.js`

*NOTE* You must have pull access to a repository for this to work correctly.

## To Run Azure Functions Locally

1. Update the `GITHUB_REPOS` values in `local.settings.json` as needed.
1. Run `npm start`
1. Visit the URL displayed in the console.

## Deploying to Azure Functions

1. Add the `GITHUB_REPOS` value (see example below) into your key vault as a secret (named `github-repos`).

    ```json
    [ { "owner": "microsoft", "repo": "MicrosoftCloud", "token": "TOKEN_VALUE" }, { "owner": "microsoft", "repo": "brainstorm-fluidframework-m365-azure", "token": "TOKEN_VALUE" } ]
    ```

1. Select the command pallet's `Azure Functions: Deploy to Function App` option.
1. Note that if the key vault `GITHUB_REPOS` value is updated, you may need to go into the function configuration in the portal and remove (or add it if it's not there) the last `/`. Otherwise, the function may cache the key vault value even after it is restarted.