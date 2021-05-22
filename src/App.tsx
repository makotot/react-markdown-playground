import { ChangeEvent, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { styled } from '@stitches/react';
import { globalStyle } from './globalStyle';
import gfm from 'remark-gfm';
import ReactJson from 'react-json-view';
import useInterval from '@use-it/interval';
import { directive, markdownDirective } from './markdownDirective';

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'minmax(120px, 240px) 1fr 1fr 1fr',
  columnGap: '1rem',
  height: '100vh',
  overflow: 'hidden',
});

const Textarea = styled('textarea', {
  width: '100%',
  minHeight: '100vh',
  padding: '1rem',
  border: 0,
  outline: 0,
  backgroundColor: '#333',
  color: '#fff',
});

const Editor = styled('div', {
  wordBreak: 'break-all',
});

const JsonView = styled('div', {
  padding: '1rem',
  overflow: 'scroll',
  wordBreak: 'break-all',
});

const Preview = styled('div', {
  padding: '1rem',
  overflow: 'scroll',
  wordBreak: 'break-all',
});

const Setting = styled('div', {
  padding: '1rem',
  overflow: 'scroll',
  wordBreak: 'break-all',
});

const REMARK_PLUGIN_NAMES = {
  DIRECTIVE: 'directive',
  MARKDOWN_DIRECTIVE: 'markdownDirective',
  GFM: 'gfm',
  LOG: 'log',
} as const;

function App() {
  globalStyle();

  const [value, updateValue] = useState('# ReactMarkdown Playground');
  const handleUpdateValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateValue(e.target.value);
  };

  const json = useRef({});
  const log = () => {
    return (tree: any) => {
      json.current = tree;
    };
  };
  const [jsonTree, updateJsonTree] = useState({});
  useInterval(() => {
    updateJsonTree(json.current);
  }, 1000);

  const pluginMap = {
    log,
    gfm,
    directive,
    markdownDirective,
  };
  const [remarkPlugins, updateRemarkPlugins] = useState<string[]>([
    REMARK_PLUGIN_NAMES.LOG,
  ]);
  const handleUpdateRemarkPlugins = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (remarkPlugins.includes(value)) {
      if (value === REMARK_PLUGIN_NAMES.MARKDOWN_DIRECTIVE) {
        updateRemarkPlugins(
          remarkPlugins.filter(
            (plugin) =>
              plugin !== value && plugin !== REMARK_PLUGIN_NAMES.DIRECTIVE
          )
        );
      } else {
        updateRemarkPlugins(remarkPlugins.filter((plugin) => plugin !== value));
      }
    } else {
      if (value === 'markdownDirective') {
        updateRemarkPlugins([
          REMARK_PLUGIN_NAMES.DIRECTIVE,
          value,
          ...remarkPlugins,
        ]);
      } else {
        updateRemarkPlugins([value, ...remarkPlugins]);
      }
    }
  };

  return (
    <div className="App">
      <Grid>
        <Setting>
          <h2>remarkPlugins</h2>
          <ul>
            <li>
              <input
                type="checkbox"
                value={REMARK_PLUGIN_NAMES.GFM}
                onChange={handleUpdateRemarkPlugins}
              />
              <label>{REMARK_PLUGIN_NAMES.GFM}</label>
            </li>
            <li>
              <input
                type="checkbox"
                value={REMARK_PLUGIN_NAMES.MARKDOWN_DIRECTIVE}
                onChange={handleUpdateRemarkPlugins}
              />
              <label>{REMARK_PLUGIN_NAMES.MARKDOWN_DIRECTIVE}</label>
            </li>
          </ul>
        </Setting>
        <Editor>
          <Textarea value={value} onChange={handleUpdateValue} />
        </Editor>
        <Preview>
          <ReactMarkdown
            remarkPlugins={Object.entries(pluginMap)
              .filter((entry) => remarkPlugins.includes(entry[0]))
              .map((entry) => entry[1])}>
            {value}
          </ReactMarkdown>
        </Preview>
        <JsonView>
          <ReactJson src={jsonTree} collapsed={3} />
        </JsonView>
      </Grid>
    </div>
  );
}

export default App;
