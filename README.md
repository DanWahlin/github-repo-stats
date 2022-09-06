# Example of Using the GitHub API to Get a Repository's Clone, Fork, and View Count

1. `npm install`
1. Set the `GITHUB_REPOS` environment variable to define the repos to query and the personal access token to use for each one:

    ```
    export GITHUB_REPOS="[ { \"owner\": \"microsoft\", \"repo\": \"MicrosoftCloud\", \"token\": \"token-value\" }, { \"owner\": \"microsoft\", \"repo\": \"brainstorm-fluidframework-m365-azure\", \"token\": \"token-value\" } ]"
    ```

1. Run `node getStats.js`

*NOTE* You must have pull access to a repository for this to work correctly.

## To Run Azure Functions Locally

1. Update the `GITHUB_REPOS` values in `local.settings.json` as needed.
1. Run `npm start`
1. Visit the URL displayed in the console.

## Deploying to Azure Functions

1. Select the command pallet's `Azure Functions: Deploy to Function App` option.
2. Note that if the key vault `GITHUB_REPOS` value is updated, you may need to go into the function configuration in the portal and remove (or add it if it's not there) the last `/`. Otherwise, the function may cache the key vault value even after it is restarted.