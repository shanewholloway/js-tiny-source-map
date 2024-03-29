/* A tiny implementation of SourceMapGenerator usable in ES Module, CommonJS, and Browser friendly formats

API:

    {
      addMapping({generated:{line, column}, original:{line, column}, source, name}) {},
      setSourceContent(source, content) {},

      toString() {},
      toJSON() {},
    }

Inspired and extracted from
  require('source-map/lib/source-map-generator.js')

*/

function tiny_source_map_generator(src_map) {
  src_map = {version: 3, ... (src_map || {}) };

  const sources = [];
  const names = [];
  const mappings = [];
  const contents = new Map();

  return {
    toJSON, toString: () => JSON.stringify(toJSON()),

    setSourceContent(source, source_content) {
      if (null != source_content)
        contents.set(`${source}`, source_content);
      else contents.delete(`${source}`);
    },

    addMapping({generated, original, source, name}) {
      const m = {
        gl: generated.line,
        gc: generated.column,
        ol: original != null && original.line,
        oc: original != null && original.column, };

      if (null != source) {
        m.source = source = `${source}`;
        if (! sources.includes(source))
          sources.push(source);
      }

      if (null != name) {
        m.name = name = `${name}`;
        if (! names.includes(name))
          names.push(name);
      }

      mappings.push(m);
    },
  }


  function toJSON() {
    const res_src_map = {
      ... src_map,
      sources: [... sources],
      names: [... names]};

    res_src_map.mappings =
      _serializeMappings(
        mappings, res_src_map);

    if (0 !== contents.size)
      res_src_map.sourcesContent =
        res_src_map.sources.map(
          key => contents.get(key) || null);

    return res_src_map
  }
}


function _serializeMappings(mappings, src_map) {
  const vlq_gen_column = _vlq_state(0);
  const vlq_orig_column = _vlq_state(0);
  const vlq_orig_line = _vlq_state(0);
  const vlq_name = _vlq_state(0);
  const vlq_source = _vlq_state(0);

  let line=1, result = '', prev_tip;
  for (const tip of mappings) {
    let sz = '';

    if (tip.gl !== line) {
      vlq_gen_column(0);
      while (tip.gl !== line) {
        sz += ';';
        line++;
      }
    } else if (undefined !== prev_tip) {
      if (0 === cmp_srcmappings(tip, prev_tip))
        continue // if we didn't move forward, ignore it!

      sz += ',';
    }

    sz += vlq_gen_column(tip.gc);

    if (tip.source != null) {
      sz += vlq_source(src_map.sources.indexOf(tip.source));
      sz += vlq_orig_line(tip.ol - 1);
      sz += vlq_orig_column(tip.oc);

      if (tip.name != null) {
        sz += vlq_name(src_map.names.indexOf(tip.name));
      }
    }

    // success; move forward
    result += sz;
    prev_tip = tip;
  }

  return result
}

function _vlq_state(v0) {
  const vlq = v => {
    const res = _b64_vlq(v - v0);
    vlq.value = v0 = v;
    return res
  };

  vlq.value = v0;
  return vlq
}


const strcmp = (a, b) =>
  a == b ? 0
    : null == a ? 1
    : null == b ? -1
    : a > b ? 1 : -1;

const cmp_srcmappings = (a,b) => (
     a.gl - b.gl
  || a.gc - b.gc
  || strcmp(a.source, b.source)
  || a.ol - b.ol
  || a.oc - b.oc
  || strcmp(a.name, b.name) );


const _vlq_low = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef';
const _vlq_high = 'ghijklmnopqrstuvwxyz0123456789+/';
function _b64_vlq(v) {
  // move sign to LSB for VLQ encoding
  v = v >= 0
    ? (v << 1)
    : 1 | ( -v << 1 );

  let res = '';
  while (true) {
    // use lower 5 bits to generate a b64 symbol
    let d = v & 0x1f;
    v >>>= 5;
    if (0 === v) {
      res += _vlq_low[d];
      return res
    }

    res += _vlq_high[d];
  }
}

export default tiny_source_map_generator;
