import { visit } from 'unist-util-visit';
import directive from 'remark-directive';

// ref: https://github.com/remarkjs/react-markdown/issues/585

export { directive };
export const markdownDirective = () => {
  return (tree: any) => {
    visit(
      tree,
      ['textDirective', 'leafDirective', 'containerDirective'],
      (node) => {
        node.data = {
          hName: node.name,
          hProperties: node.attributes,
          ...node.data,
        };
      }
    );
  };
};
