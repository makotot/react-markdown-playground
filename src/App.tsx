import { ChangeEvent, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { styled, global } from '@stitches/react';
import gfm from 'remark-gfm';
import ReactJson from 'react-json-view';
import useInterval from '@use-it/interval';

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
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

function App() {
  globalStyle();

  const json = useRef({});
  const log = () => {
    return (tree: any) => {
      json.current = tree;
    };
  };
  const [value, updateValue] = useState('# ReactMarkdown Playground');
  const handleUpdateValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateValue(e.target.value);
  };

  const [jsonTree, updateJsonTree] = useState({});
  useInterval(() => {
    updateJsonTree(json.current);
  }, 1000);

  return (
    <div className="App">
      <Grid>
        <Editor>
          <Textarea value={value} onChange={handleUpdateValue} />
        </Editor>
        <Preview>
          <ReactMarkdown remarkPlugins={[gfm, log]}>{value}</ReactMarkdown>
        </Preview>
        <JsonView>
          <ReactJson src={jsonTree} collapsed={3} />
        </JsonView>
      </Grid>
    </div>
  );
}

export default App;
