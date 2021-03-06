### About target-environment settings

This directory contains one settings JSON file per each build distribution's target-environment:

    * local (aka development)
    * testing`
    * acceptance
    * production

Settings to be determined in such a file include:

    setting         | explanation
    :---            | :---
    `environment`   | The target-environment's name (production, acceptance, testing, staging, local, etc). Should really be identical to the settings file's name (excluding the `.json` extension).
    `api`           | A mappping of symbolic API names to their services' base URLs.
    `locales`       | A list of available locales.

Feel free to add further files to this directory as you see fit; for instance `<yourname>.js` for your personal local development configuration.

Just keep in mind that the [`Gruntfile.coffee`](../Gruntfile.coffee) is tailored towards using the defaults outlined above, and that you would need to supply a
`--target=<environment>` argument to the `grunt` command to override that default.

So, to target a development build distribution to use settings different from `local.json`, f.i. `<yourname>.json`, use

```sh
grunt dev --target=<yourname>`
```

To target a production build distribution to use the `acceptance.json` settings instead of `production.json`, use:

```sh
grunt --target=acceptance`
```

#### Example settings file

```json
{
    "api": {
        "default": "/api"
    },
    "environment": "production",
    "locales": {
        "en-GB": "English",
        "en-US": "English (US)",
        "nl-NL": "Nederlands",
    }
}
```

For more detailed information on builds, distributions and target-environments, see the introductory comments included within the
[`Gruntfile.coffee`](../Grunfile.coffee)
