// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Templates keep the first attribute on the tag's line and wrap the rest.
      'vue/first-attribute-linebreak': 'off',
    },
  },
)
