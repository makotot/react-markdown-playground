import { visitParents } from 'unist-util-visit-parents';
import { findAfter } from 'unist-util-find-after';

const transform = (start: any, ancestors: any) => {
  const parent = ancestors[ancestors.length - 1];
  const end = findAfter(
    parent,
    start,
    (node) => node.type === 'text' && (node.value as any).trim() === '##}}'
  );
  console.log({ start, parent, end });
  const startIndex = parent.children.indexOf(start);
  const endIndex = parent.children.indexOf(end);
  const between = parent.children.slice(
    startIndex + 1,
    endIndex > 0 ? endIndex : undefined
  );

  console.log(
    between,
    startIndex,
    endIndex,
    parent.children.splice(startIndex, endIndex - 1)
  );

  parent.children.splice(startIndex, endIndex, {
    type: 'term',
    children: between,
    data: {
      hName: 'term',
    },
  });
};

export const termRange = () => {
  return (tree: any) => {
    visitParents(
      tree,
      (node) => node.type === 'text' && (node.value as any).trim() === '{{##',
      transform
    );
  };
};
