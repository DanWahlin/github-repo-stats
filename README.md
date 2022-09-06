# Example of Using the GitHub API to Get a Repository's Clone, Fork, and View Count

1. `npm install`
1. Set the `GITHUB_REPOS` environment variable to define the repos to query and the personal access token to use for each one:

    ```
    export GITHUB_REPOS="[ { \"owner\": \"microsoft\", \"repo\": \"MicrosoftCloud\", \"token\": \"token-value\" }, { \"owner\": \"microsoft\", \"repo\": \"brainstorm-fluidframework-m365-azure\", \"token\": \"token-value\" } ]"
    ```

1. Run `node getStats.js`

*NOTE* You must have pull access to a repository for this to work correctly.