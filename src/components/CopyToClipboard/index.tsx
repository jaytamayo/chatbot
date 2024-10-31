import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard as Clipboard, Props } from 'react-copy-to-clipboard';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const CopyToClipboard = ({ text }: Props) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation('common');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Clipboard text={text} onCopy={handleCopy}>
            {copied ? <CheckOutlined /> : <CopyOutlined />}
          </Clipboard>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? t('copied') : t('copy')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipboard;
