# Old Learning Hub URL compatibility

`hub-compat/` is a frozen copy of 88 public build files from the standalone
Learning Hub migration (`Nixcentury/learning-hub`, commit `5da6e28`). It contains
only the already-public pages, teaching content, scripts, styles, fonts and
assets, plus the former admin entry point. No database export or credentials.

The packaging script publishes these files at their previous paths, without
the `.github/hub-compat/` prefix. For example, old links to
`/Physic-subject/pages/tools/quiz-player.html` and
`/Physic-subject/shared/learning-hub-tools.js` continue resolving. The content
fragments are kept intact for fetch clients; they are not replaced by redirect
HTML. Cached old Hub entry points retain their hashed assets too.

The repository root is a small landing page linking to the new Hub and retains
the selected subject hash. Ordinary standalone HTML keeps its original path.

This snapshot is compatibility-only, not a second authoring source. Add or edit
Hub content in `Nixcentury/learning-hub`. Changes in `LEARNING HUB/` here no
longer trigger Pages or enter its artifact. Do not remove compatibility files
until old consumers have been migrated and tested. Packaging rejects any path
collision with ordinary files rather than silently overwriting either copy.
