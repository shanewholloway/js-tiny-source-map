# tiny-source-map

A tiny implementation of SourceMapGenerator usable in ES Module, CommonJS, and
Browser friendly formats

Inspired and extracted from `require('source-map/lib/source-map-generator.js')`
of Mozilla's wonderful [source-map library][source-map] under BSD-3 license.

 [source-map]: https://www.npmjs.com/package/source-map

### API

```javascript

import tiny_source_map_generator from 'tiny-source-map'

// ...

const src_map = tiny_source_map_generator()

src_map.addMapping({
  generated:{line, column},
  original:{line, column},
  source,
  name,
})

src_map.setSourceContent(source, content)

src_map.toJSON()

src_map.toString()

```


## License

[BSD-3 Clause][./LICENSE]

