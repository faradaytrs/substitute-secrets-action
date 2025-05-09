# Substitute Secrets, Variables or anythign you want into tokenized files

Substitute GitHub secrets, env, variables into a File, matching on a specified Token format.

**Use cases**

You have configuration files that contain tokens that need to be replaced with values from GitHub Secrets, Environment Variables or any other source.

```
CONNECTIONSTRING = mysql://user:password@host:port/database;
```

And you have configuration file that contains ${CONNECTIONSTRING} tokens that need to be replaced with the actual value.

**Workflow YAML**

```yaml
- name: Substitute Secrets Action
  uses: faradaytrs/substitute-secrets-action@v2.3.0
  with:

    # Files specified by the glob pattern
    # Any glob pattern
    input: **/*.json

    # A regex to match tokens. Must contain a capturing group.
    #   \$\{([A-Z0-9_]+)\} matches ${TOKEN}
    substitutionRegex: \$\{([A-Z0-9_]+)\}

    # Substitution data to use. This is a JSON string.
    # "${{ toJSON(secrets) }}" or "${{ toJSON(env) }}" or "${{ toJSON(vars) }}".
    substitutionData: ${{ toJSON(secrets) }}

    # Whether to fail the action if a token is not found in the substitution data.
    throwOnDataMissing: false
````
