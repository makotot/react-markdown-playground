import { ChangeEvent, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { styled, global } from '@stitches/react';
import gfm from 'remark-gfm';
import ReactJson from 'react-json-view';
import useInterval from '@use-it/interval';

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

const globalStyle = global({
  '*': {
    boxSizing: 'border-box',
  },
});

const Setting = styled('div', {
  padding: '1rem',
  overflow: 'scroll',
  wordBreak: 'break-all',
});

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
  };
  const [remarkPlugins, updateRemarkPlugins] = useState<string[]>(['log']);
  const handleUpdateRemarkPlugins = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (remarkPlugins.includes(value)) {
      updateRemarkPlugins(remarkPlugins.filter((plugin) => plugin !== value));
    } else {
      updateRemarkPlugins([...remarkPlugins, value]);
    }
  };

  return (
    <div className="App">
      <Grid>
        <Setting>
          <input
            type="checkbox"
            value="gfm"
            onChange={handleUpdateRemarkPlugins}
          />
          <label>gfm</label>
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
