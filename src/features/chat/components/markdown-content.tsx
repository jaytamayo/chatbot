import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import reactStringReplace from 'react-string-replace';
import { visitParents } from 'unist-util-visit-parents';
import { useFetchDocumentThumbnailsByIds } from '~/hooks/useFetchDocumentThumbnailsByIds';
import { IReference } from './types';

const reg = /(#{2}\d+\${2})/g;
const curReg = /(~{2}\d+\${2})/g;

const MarkdownContent = ({
  reference,
  content,
  loading,
}: {
  content: string;
  loading: boolean;
  reference: IReference;
}) => {
  const { t } = useTranslation();

  const { setDocumentIds } = useFetchDocumentThumbnailsByIds();

  const contentWithCursor = useMemo(() => {
    let text = content;
    if (text === '') {
      text = t('chat.searching');
    }
    return loading ? text?.concat('~~2$$') : text;
  }, [content, loading, t]);

  useEffect(() => {
    setDocumentIds(reference?.doc_aggs?.map((x) => x.doc_id) ?? []);
  }, [reference, setDocumentIds]);

  const rehypeWrapReference = () => {
    return function wrapTextTransform(tree: any) {
      visitParents(tree, 'text', (node, ancestors) => {
        const latestAncestor = ancestors.at(-1);
        if (
          latestAncestor.tagName !== 'custom-typography' &&
          latestAncestor.tagName !== 'code'
        ) {
          node.type = 'element';
          node.tagName = 'custom-typography';
          node.properties = {};
          node.children = [{ type: 'text', value: node.value }];
        }
      });
    };
  };

  const renderReference = useCallback((text: string) => {
    let replacedText = reactStringReplace(text, reg, () => {
      // removed reference popover this is where you can view which knowledge the ai answer came from
      return null;
    });

    replacedText = reactStringReplace(replacedText, curReg, (match, i) => (
      <span key={i}></span>
    ));

    return replacedText;
  }, []);

  return (
    <Markdown
      rehypePlugins={[rehypeWrapReference]}
      remarkPlugins={[remarkGfm]}
      components={
        {
          'custom-typography': ({ children }: { children: string }) =>
            renderReference(children),
          code(props: any) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter {...rest} PreTag='div' language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        } as any
      }
    >
      {contentWithCursor}
    </Markdown>
  );
};

export default MarkdownContent;
