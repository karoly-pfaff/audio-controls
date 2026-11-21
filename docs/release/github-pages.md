# GitHub Pages documentation

The site source is docs/site; npm run docs:build writes the complete static Pages content into
docs/site/build. Engineering Markdown stays elsewhere under the same docs/ namespace. The build
contains index.html and a local no-Jekyll marker; it needs no runtime server, CDN or account.
The custom Actions deployment does not run Jekyll.

## Hosted setup

1. In the public karoly-pfaff/audio-controls-react repository, open Settings → Pages.
2. Under Build and deployment, select GitHub Actions as the source.
3. Ensure the github-pages environment allows deployment from main. Configure any desired
   environment review rules explicitly; an environment name alone does not enable protection.
4. Push the reviewed main commit, or manually run Library quality on main.
5. The verify job runs package/consumer checks, the strict serial gate and docs:build. It uploads
   docs/site/build as the github-pages artifact only for a main-branch run, never a PR.
6. After verification succeeds, the pages job uses actions/deploy-pages with pages:write and
   id-token:write. Its deployment output supplies the actual site URL to the environment.

Expected project URL: https://karoly-pfaff.github.io/audio-controls-react/.

There is no gh-pages source branch and no generated-site commit. Main-branch CI changes publish
the current documentation automatically after passing checks. A pull request retains an HTML
preview in the normal candidate artifact without deploying it. The package publication workflow
does not publish Pages from version tags; it retains its own matching HTML candidate artifact.

## Local verification

```sh
npm ci
npm run package:check
npm run check
npm run docs:build
```

Open docs/site/build/index.html directly or serve docs/site/build locally. The page embeds all
scripts/styles and uses fragment anchors, so it works at the repository project path without
root-relative asset URLs. Inspect the Pages workflow locally as configuration; GitHub permissions,
Pages settings and the live deployment are checked in the hosted workflow.

The site output is ignored generated content and is excluded from the npm package. Keep authored
content under docs/site/content and UI under docs/site/sources. Do not generate into the Markdown
guides or the library's build/ directory.

Reference: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
